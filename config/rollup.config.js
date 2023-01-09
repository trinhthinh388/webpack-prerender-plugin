/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-var-requires */
const dts = require('rollup-plugin-dts').default
const esbuild = require('rollup-plugin-esbuild').default
const path = require('path')

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.resolve(PACKAGE_ROOT_PATH, 'package.json'))
const NAME = PKG_JSON.main.replace(/\.js$/, '')

const bundle = config => ({
  ...config,
  input: 'src/index.ts',
  external: id => !/^[./]/.test(id),
})

module.exports = [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${NAME}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${NAME}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${NAME}.d.ts`,
      format: 'es',
    },
  }),
]