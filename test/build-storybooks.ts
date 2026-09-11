import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

await Promise.all(
  [
    ['example/.storybook', 'storybook-static'],
    ['example/.storybook-mcp', 'storybook-static-mcp'],
  ].map(async ([config, output]) => {
    const startedAt = performance.now();
    try {
      await exec(
        process.execPath,
        [
          'node_modules/storybook/dist/bin/dispatcher.js',
          'build',
          '-c',
          config,
          '-o',
          output,
          '--disable-telemetry',
        ],
        { maxBuffer: 5 * 1024 * 1024 },
      );
    } catch (error) {
      if (error instanceof Error) {
        if ('stdout' in error) process.stderr.write(String(error.stdout));
        if ('stderr' in error) process.stderr.write(String(error.stderr));
      }
      throw error;
    } finally {
      console.error(`Build ${config}: ${((performance.now() - startedAt) / 1000).toFixed(2)}s`);
    }
  }),
);
