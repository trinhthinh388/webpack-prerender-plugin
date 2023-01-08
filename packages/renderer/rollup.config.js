/* eslint-disable @typescript-eslint/no-var-requires */
const dts = require('rollup-plugin-dts').default
const esbuild = require('rollup-plugin-esbuild').default
const name = require('./package.json').main.replace(/\.js$/, '')

const bundle = config => ({
  input: 'dist/index.js',
  external: id => !/^[./]/.test(id),
  ...config,
})

module.exports = [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `dist/${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `dist/${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    input: `src/index.ts`,
    output: {
      file: `dist/${name}.d.ts`,
      format: 'es',
    },
  }),
]