import type { Link, Image, Definition } from 'mdast';
import type { MarkdownOptions } from './index.js';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'tinyglobby';
import { isMap, parseDocument } from 'yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

export interface ContentOptions extends MarkdownOptions {
  root: string;
  output: string;
}

export interface Frontmatter extends Record<string, unknown> {
  title?: string;
  stories?: string | string[];
  tags?: string[];
  status?: string;
}

export type DiscoveredDocument = Awaited<ReturnType<typeof discover>>[number];

const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkStringify);
const storyExtensions = ['tsx', 'ts', 'jsx', 'js'];
export const slash = (value: string) => value.split(path.sep).join('/');
export const fail = (source: string, message: string) =>
  new Error(`[storybook-addon-md] ${source}: ${message}`);

export async function localFile(file: string, root: string, source: string, kind: string) {
  try {
    const actual = await realpath(file);
    const relative = path.relative(await realpath(root), actual);

    if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
      throw fail(source, `${kind} must be inside root: ${file}`);
    }

    if (!(await stat(actual)).isFile()) throw new Error('not a file');

    return file;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('[storybook-addon-md]')) throw error;

    throw Object.assign(fail(source, `missing ${kind}: ${file}`), { dependency: file });
  }
}

export function parseMarkdown(
  text: string,
  source: string,
): { body: string; metadata: Frontmatter } {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) return { body: normalized, metadata: {} };

  const end = /^---\s*$/gm;

  end.lastIndex = 4;

  const closing = end.exec(normalized);

  if (!closing) throw fail(source, 'frontmatter must end with ---');

  const yaml = parseDocument(normalized.slice(4, closing.index), { uniqueKeys: true });

  if (yaml.errors.length) throw fail(source, `invalid frontmatter: ${yaml.errors[0].message}`);

  if (yaml.warnings.length) throw fail(source, `invalid frontmatter: ${yaml.warnings[0].message}`);

  if (yaml.contents && !isMap(yaml.contents)) throw fail(source, 'frontmatter must be a mapping');

  let metadata: Frontmatter;

  try {
    metadata = yaml.toJS({ maxAliasCount: 50 }) ?? {};
    JSON.stringify(metadata, (_, value) => {
      if (typeof value === 'number' && !Number.isFinite(value))
        throw new Error('metadata numbers must be finite');

      return value;
    });
  } catch (error) {
    throw fail(
      source,
      `invalid frontmatter: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw fail(source, 'frontmatter must be a mapping');
  }

  for (const key of Object.keys(metadata)) {
    if (!/^[a-z][a-z0-9_-]*$/.test(key))
      throw fail(source, `frontmatter keys must be lowercase: ${key}`);
  }

  if ('title' in metadata && (typeof metadata.title !== 'string' || !metadata.title.trim())) {
    throw fail(source, 'title must be a non-empty string');
  }

  if ('status' in metadata && (typeof metadata.status !== 'string' || !metadata.status.trim())) {
    throw fail(source, 'status must be a non-empty string');
  }

  if (
    'tags' in metadata &&
    (!Array.isArray(metadata.tags) ||
      metadata.tags.some((tag) => typeof tag !== 'string' || !tag.trim()))
  ) {
    throw fail(source, 'tags must be an array of non-empty strings');
  }

  if ('stories' in metadata) {
    const references = Array.isArray(metadata.stories) ? metadata.stories : [metadata.stories!];

    if (!references.length || references.some((ref) => typeof ref !== 'string' || !ref.trim())) {
      throw fail(source, 'stories must be a relative path or a non-empty array of relative paths');
    }
  }

  return { body: normalized.slice(closing.index + closing[0].length).replace(/^\n/, ''), metadata };
}

async function associations(file: string, metadata: Frontmatter, root: string) {
  if ('stories' in metadata) {
    const references = Array.isArray(metadata.stories) ? metadata.stories : [metadata.stories!];

    return Promise.all(
      [...new Set(references)].map(async (ref) => {
        if (path.isAbsolute(ref) || !/\.stories\.[jt]sx?$/.test(ref)) {
          throw fail(
            file,
            `stories must reference a relative .stories.js, .jsx, .ts, or .tsx file: ${ref}`,
          );
        }

        return localFile(path.resolve(path.dirname(file), ref), root, file, 'story reference');
      }),
    );
  }

  if (!file.endsWith('.metadata.md')) return [];

  const base = file.slice(0, -'.metadata.md'.length);
  const matches = [];

  for (const extension of storyExtensions) {
    const candidate = `${base}.stories.${extension}`;

    if (
      await stat(candidate).then(
        (value) => value.isFile(),
        () => false,
      )
    )
      matches.push(candidate);
  }

  if (matches.length !== 1) {
    throw Object.assign(
      fail(
        file,
        matches.length
          ? 'ambiguous sibling stories; set stories explicitly'
          : 'missing sibling story for .metadata.md; set stories explicitly or rename the Markdown file',
      ),
      { dependencies: storyExtensions.map((extension) => `${base}.stories.${extension}`) },
    );
  }

  return [await localFile(matches[0], root, file, 'story reference')];
}

export async function resolveAssets(body: string, file: string, root: string) {
  const tree = markdown.parse(body);
  const nodes: (Link | Image | Definition)[] = [];

  visit(tree, (node) => {
    if (node.type === 'image' || node.type === 'link' || node.type === 'definition')
      nodes.push(node);
  });

  const assets: { file: string; suffix: string; token: string }[] = [];

  for (const node of nodes) {
    const url = node.url;

    if (!url || /^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(url)) continue;

    const [, pathname, suffix = ''] = /^([^?#]*)(.*)$/.exec(url)!;
    let decoded;

    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      throw fail(file, `invalid local URL: ${url}`);
    }

    const asset = await localFile(
      path.resolve(path.dirname(file), decoded),
      root,
      file,
      'local asset',
    );
    const token = `SBMDASSET${assets.length}END`;

    if (body.includes(token)) throw fail(file, `reserved asset token in content: ${token}`);

    assets.push({ file: asset, suffix, token });
    node.url = token;
  }

  return { markdown: markdown.stringify(tree), assets };
}

export async function discover({ root, patterns, output }: ContentOptions) {
  if (
    !Array.isArray(patterns) ||
    !patterns.length ||
    patterns.some(
      (item) =>
        typeof item !== 'string' ||
        !item ||
        path.isAbsolute(item) ||
        item.split('/').includes('..'),
    )
  ) {
    throw fail(root, 'patterns must be a non-empty array of globs relative to root');
  }

  const files = await glob(patterns, {
    cwd: root,
    absolute: true,
    onlyFiles: true,
    expandDirectories: false,
    followSymbolicLinks: false,
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      '**/storybook-static/**',
      `${slash(path.relative(root, output))}/**`,
    ],
  });

  return Promise.all(
    files
      .sort()
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        await localFile(file, root, file, 'Markdown file');

        const original = await readFile(file, 'utf8');
        const { body, metadata } = parseMarkdown(original, file);
        const stories = await associations(file, metadata, root);
        const content = await resolveAssets(body, file, root);

        return {
          file,
          original,
          source: slash(path.relative(root, file)),
          title:
            metadata.title ??
            `Documentation/${slash(path.relative(root, file)).replace(/\.md$/, '')}`,
          metadata,
          stories,
          ...content,
        };
      }),
  );
}
