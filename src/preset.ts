import type { UserConfig, ViteDevServer } from 'vite';
import type { MarkdownOptions } from './index.js';
import type { ContentOptions, DiscoveredDocument } from './content.js';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { watch } from 'chokidar';
import glob from 'fast-glob';
import picomatch from 'picomatch';
import { generate, writeChanged } from './generator.js';
import { fail, slash } from './content.js';

type PresetOptions = MarkdownOptions & { configDir: string };

type StoryEntry = string | { directory: string; files?: string; titlePrefix?: string };

const sessions = new Map<
  string,
  { config: ContentOptions; ready: Promise<DiscoveredDocument[]> }
>();

function settings(options: PresetOptions) {
  const configDir = path.resolve(options.configDir);
  const root = path.resolve(configDir, options.root ?? '..');
  const generatedDir = options.generatedDir ?? 'storybook-markdown-generated';

  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(generatedDir) ||
    ['node_modules', 'storybook-static'].includes(generatedDir)
  ) {
    throw fail(
      configDir,
      'generatedDir must be a visible folder name containing only letters, digits, hyphens or underscores',
    );
  }

  return {
    root,
    output: path.join(
      process.cwd(),
      generatedDir,
      createHash('sha256').update(configDir).digest('hex').slice(0, 12),
    ),
    patterns: options.patterns,
    exclude: options.exclude,
    stylesheet: options.stylesheet ? path.resolve(root, options.stylesheet) : undefined,
    presentation: options.presentation ? path.resolve(root, options.presentation) : undefined,
  };
}

export async function stories(existing: StoryEntry[] = [], options: PresetOptions) {
  const key = path.resolve(options.configDir);

  if (!sessions.has(key)) {
    const config = settings(options);

    sessions.set(key, { config, ready: generate(config) });
  }

  const session = sessions.get(key)!;

  await session.ready;

  return [...existing, { directory: session.config.output, files: '*.mdx' }];
}

export function watchDocumentation(
  config: ContentOptions,
  {
    onError = () => {},
    onUpdate = () => {},
  }: { onError?: (error: Error) => void; onUpdate?: () => void } = {},
) {
  const matchers = glob
    .generateTasks(config.patterns, { ignore: config.exclude ?? [] })
    .map((task) => ({
      include: picomatch(task.positive),
      exclude: picomatch(task.negative),
    }));
  const dependencies = new Set<string>();
  const configuredDependencies = [config.presentation, config.stylesheet].filter(
    (file): file is string => Boolean(file),
  );

  let timer: ReturnType<typeof setTimeout> | undefined;
  let closed = false;
  let queue = Promise.resolve();
  const refresh = () => {
    queue = queue.then(async () => {
      if (closed) return;

      try {
        const documents = await generate(config);

        dependencies.clear();
        for (const file of configuredDependencies) dependencies.add(file);
        for (const document of documents) {
          for (const file of document.stories) dependencies.add(file);
          for (const asset of document.assets) dependencies.add(asset.file);
          if (document.file.endsWith('.metadata.md') && !('stories' in document.metadata)) {
            for (const extension of ['js', 'jsx', 'ts', 'tsx']) {
              dependencies.add(document.file.replace(/\.metadata\.md$/, `.stories.${extension}`));
            }
          }
        }
        onUpdate();
      } catch (caught) {
        const error = caught instanceof Error ? caught : new Error(String(caught));

        if ('dependencies' in error && Array.isArray(error.dependencies)) {
          for (const file of error.dependencies)
            if (typeof file === 'string') dependencies.add(file);
        }

        if ('dependency' in error && typeof error.dependency === 'string')
          dependencies.add(error.dependency);

        await writeChanged(
          path.join(config.output, 'status.js'),
          `throw new Error(${JSON.stringify(error.message)});\n`,
        );
        onError(error);
      }
    });

    return queue;
  };
  const watcher = watch(config.root, {
    ignoreInitial: true,
    ignored: (file) =>
      file === config.output ||
      /(?:^|[/\\])(?:node_modules|\.git|storybook-static)(?:[/\\]|$)/.test(file),
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 20 },
  });

  watcher.on('all', (event, file) => {
    if (event === 'addDir' || event === 'unlinkDir') return;

    const relative = slash(path.relative(config.root, file));
    const markdown =
      file.endsWith('.md') &&
      matchers.some(({ include, exclude }) => include(relative) && !exclude(relative));

    if (!markdown && !dependencies.has(file) && !configuredDependencies.includes(file)) return;

    clearTimeout(timer);
    timer = setTimeout(refresh, 80);
  });
  watcher.on('error', (error) =>
    onError(error instanceof Error ? error : new Error(String(error))),
  );

  const ready = new Promise<void>((resolve) =>
    watcher.once('ready', () => refresh().then(resolve)),
  );

  return {
    ready,
    async close() {
      closed = true;
      clearTimeout(timer);
      await watcher.close();
      await queue;
    },
  };
}

export async function viteFinal(config: UserConfig, options: PresetOptions): Promise<UserConfig> {
  const session = sessions.get(path.resolve(options.configDir))?.config ?? settings(options);

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      {
        name: 'storybook-addon-md',
        configureServer(server: ViteDevServer) {
          const watcher = watchDocumentation(session, {
            onError(error) {
              server.config.logger.error(error.message);
              server.ws.send({ type: 'error', err: { message: error.message, stack: '' } });
            },
          });

          server.httpServer?.once('close', () => void watcher.close());
        },
      },
    ],
  };
}

export function webpackFinal() {
  throw fail('builder', 'only @storybook/react-vite 10.6.0 with Vite 7 is supported');
}
