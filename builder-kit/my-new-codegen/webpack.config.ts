import glob from 'glob'
import * as path from 'path'
import { kebabCase } from './src/utils'
import { Configuration } from 'webpack'

// Returns a mapping of kebab-case codegen template names,
// then used to do [foldername]/actions-codegen.js for output
// {
//   'go-serve-mux': './src/templates/goServeMux.codegen.ts',
//   'ruby-rails': './src/templates/rubyRails.codegen.ts',
// }
const mapCodegenFilesToOutputFolders = (res, path) => {
  const [fileName] = path.replace('./src/templates/', '').split('.')
  const folderName = kebabCase(fileName)
  res[folderName] = path
  return res
}

const codegenFiles = glob
  .sync('./src/templates/**.codegen.ts')
  .reduce(mapCodegenFilesToOutputFolders, {})

const config: Configuration = {
  mode: 'production',
  entry: codegenFiles,
  externals: {
    graphql: 'graphql',
  },
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
    path: path.resolve(__dirname, '../../'),
  },
}

export default config
