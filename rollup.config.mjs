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

import pkg from './package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: './src/index.ts',
    external: ['react-dom'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      getBabelOutputPlugin({
        configFile: path.resolve(__dirname, 'babel.config.js'),
      }),
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true,
        inlineSources: true,
      }),
      postcss({ minimize: true }),
      terser({
        compress: { drop_console: true, drop_debugger: true },
      }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: pkg.types, format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
