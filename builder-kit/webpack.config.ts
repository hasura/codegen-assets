import glob from 'glob'
import * as path from 'path'
import * as webpack from 'webpack'

const kebabCase = (string) =>
  string
    .match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
    .filter(Boolean)
    .map((x) => x.toLowerCase())
    .join('-')

const codegenFiles = glob
  .sync('./src/templates/**.codegen.ts')
  .reduce((res, path) => {
    const [fileName] = path.replace('./src/templates/', '').split('.')
    const folderName = kebabCase(fileName)
    res[folderName] = path
    return res
  }, {})

const config: webpack.Configuration = {
  entry: codegenFiles,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name]/actions-codegen.js',
    path: path.resolve(__dirname, '../'),
  },
}

export default config
