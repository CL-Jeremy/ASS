import fs from 'fs';
import csso from 'csso';
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const defaultPlugins = [
  replace({
    __GLOBAL_CSS__: csso.minify(fs.readFileSync('./src/global.css')).css,
  }),
  nodeResolve(),
];

export default [{
  input: 'src/index.js',
  output: [
    {
      file: 'dist/ass.esm.js',
      format: 'esm',
    },
  ],
  plugins: defaultPlugins,
}, {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/ass.js',
      format: 'umd',
      name: 'ASS',
    },
    {
      file: 'dist/ass.min.js',
      format: 'umd',
      name: 'ASS',
      plugins: [terser()],
    },
  ],
  plugins: [
    ...defaultPlugins,
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {safari: 9},
            corejs: 3,
            useBuiltIns: 'usage',
            modules: false,
          },
        ],
      ],
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {safari: 9},
            modules: false,
          },
        ],
      ],
      plugins: ['transform-commonjs'],
    }),
  ],
}];
