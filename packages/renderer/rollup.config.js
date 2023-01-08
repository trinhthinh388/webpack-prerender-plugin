/* eslint-disable @typescript-eslint/no-var-requires */
const dts = require('rollup-plugin-dts').default
const copy = require('rollup-plugin-copy')
const esbuild = require('rollup-plugin-esbuild').default
const name = require('./package.json').main.replace(/\.js$/, '')

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
})

module.exports = [
  bundle({
    plugins: [esbuild(), copy({
      targets: [
        {
          src: 'package.json', dest: 'dist'
        }
      ]
    })],
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
    output: {
      file: `dist/${name}.d.ts`,
      format: 'es',
    },
  }),
]