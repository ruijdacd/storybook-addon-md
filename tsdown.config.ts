import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/preset.ts', 'src/runtime.tsx', 'src/node.ts'],
  format: 'esm',
  fixedExtension: false,
  target: 'es2022',
  dts: true,
  copy: [{ from: 'src/styles.css', to: 'dist' }],
});
