import { appendFileSync, createWriteStream, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'
import browserify from 'browserify'
import { rollup } from 'rollup'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const __dirname = dirname(fileURLToPath(import.meta.url))
const __root = resolve(__dirname, '../')
const __tmp = './tmp'
const __web_modules = './public/web_modules'

const entry = pkg.cjsDependencies
  .reduce((entries, entry) => ({ ...entries, [entry]: `./${entry}.js` }), {})

Object.entries(entry)
  .forEach(([ moduleName, fileName ]) => {
    const filePath = resolve(__root, __tmp, fileName)
    const fileContents = `window['${moduleName}'] = require('${moduleName}')`
    writeFileSync(filePath, fileContents)

    const outPath = resolve(__root, __web_modules, fileName)
    const outFile = createWriteStream(outPath)
    browserify()
      .add(filePath)
      .bundle()
      .pipe(outFile)
    outFile.on('finish', () => {
      unlinkSync(filePath)

      const file = readFileSync(outPath, { encoding: 'utf8' })
      const newFile = file.replace('process.config.variables.arm_version', "''")
      writeFileSync(outPath, newFile)
      const contents = `export default window['${moduleName}'];`
      appendFileSync(outPath, contents)

      const mapPath = resolve(__root, __web_modules, 'import-map.json')
      const importMap = JSON.parse(readFileSync(mapPath))
      const mapContents = {
        ...importMap,
        imports: {
          ...importMap.imports,
          [moduleName]: fileName
        }
      }
      writeFileSync(mapPath, JSON.stringify(mapContents, null, 2))

      console.log('Installed:', moduleName)
    })
  })

/*
const compiler = webpack({
  //mode: 'production',
  mode: 'development',
  context: resolve(__root, __tmp),
  entry,
  output: {
    filename: '[name].js',
    path: resolve(__root, __web_modules)
  },
  node: {
    fs: 'empty'
  }
})

compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('error', err, stats.toString())
    return
  }
  Object.entries(entry)
    .forEach(([ moduleName, fileName ]) => {
      unlinkSync(resolve(__root, __tmp, fileName))

      const filePath = resolve(__root, __web_modules, fileName)
      const contents = `export default window['${moduleName}'];`
      appendFileSync(filePath, contents)

      const mapPath = resolve(__root, __web_modules, 'import-map.json')
      const importMap = JSON.parse(readFileSync(mapPath))
      const mapContents = {
        ...importMap,
        imports: {
          ...importMap.imports,
          [moduleName]: fileName
        }
      }
      writeFileSync(mapPath, JSON.stringify(mapContents, null, 2))

      console.log('Installed:', moduleName)
    })
})
*/
