import path from 'path';
import { fileURLToPath } from 'url';

import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/esm/index.es.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({ plugins: [], minimize: true }),
      commonjs(),
      external(),
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: [
          '**/__test__',
          '**/*.test.ts',
          '**/*.test.tsx',
          'jest.config.ts',
        ],
      }),
      getBabelOutputPlugin({
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
      terser({ compress: { drop_console: true, drop_debugger: true } }),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: [/\.css$/],
  },
];
