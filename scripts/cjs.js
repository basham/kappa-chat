import rollup from 'rollup'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

const inputOptions = {
  //external:,
  input: './scripts/kappa-core.js',
  plugins: [
    json(),
    globals(),
    builtins(),
    resolve({
      mainFields: [ 'browser', 'module', 'main' ]
    }),
    commonjs({
      include: /node_modules/
    })
  ]
}
const outputOptions = {
  //dir,
  file: './scripts/kappa-core.out.js',
  format: 'esm'
  //globals,
  //name,
  //plugins
}

async function build () {
  const bundle = await rollup.rollup(inputOptions)
  //const { output } = await bundle.generate(outputOptions)
  await bundle.write(outputOptions)
}

build()
