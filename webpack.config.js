'use strict'
const path = require('path')
const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')


let config = {
  entry: {
    'helloworld-react': './helloworld-react/page.es6',
  },
  output: {
    path: path.resolve('.'),
    filename: '[name]/page.bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.es6']
  },
  node: {
    // Don't shim the process module, because electron provides it.
    process: false
  },
  module: {
    loaders: [
      {
        test: /\.es6$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          cacheDirectory: true
        }
      }
    ]
  }
}
config.target = webpackTargetElectronRenderer(config)

module.exports = config
