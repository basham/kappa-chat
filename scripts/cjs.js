import fs from 'fs'
import path from 'path'
import rollup from 'rollup'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from '@rollup/plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __root = path.resolve(__dirname, '../')
const __tmp = './tmp'
const __web_modules = './public/web_modules'
const tmpFolder = path.resolve(__root, __tmp)
const mapPath = path.resolve(__root, __web_modules, 'import-map.json')

async function build (moduleName) {

  if (!fs.existsSync(tmpFolder)) {
    fs.mkdirSync(tmpFolder)
  }

  const fileName = `${moduleName}.js`

  const tmpFilePath = path.resolve(__root, __tmp, fileName)
  //const tmpFileContents = `const _module = require('${moduleName}'); module.exports = _module;`
  //const tmpFileContents = `export * from '${moduleName}';`
  //const tmpFileContents = `const _module = require('${moduleName}'); module.exports = _module;`
  const tmpFileContents = `import _module from '${moduleName}'; export default _module;`
  fs.writeFileSync(tmpFilePath, tmpFileContents)

  const bundle = await rollup.rollup({
    input: tmpFilePath,
    plugins: [
      json(),
      moduleName === 'random-access-memory' ? null : globals(),
      builtins(),
      nodeResolve({
        mainFields: [ 'browser', 'module', 'main' ]
      }),
      commonjs()
    ]
  })

  const outFilePath = path.resolve(__root, __web_modules, fileName)

  await bundle.write({
    file: outFilePath,
    format: 'esm'
  })

  const importMap = JSON.parse(fs.readFileSync(mapPath))
  const mapContents = {
    ...importMap,
    imports: {
      ...importMap.imports,
      [moduleName]: `./${fileName}`
    }
  }
  fs.writeFileSync(mapPath, JSON.stringify(mapContents, null, 2))

  fs.unlinkSync(tmpFilePath)

  console.log('Installed:', moduleName)
}

[
  'cuid',
  'kappa-core',
  'kappa-view-list',
  //'level',
  //'level-mem',
  //'memdb',
  'random-access-memory',
  //'subleveldown'
].forEach((moduleName) => build(moduleName))
