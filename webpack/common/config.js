const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.graphql$/,
        use: [{ loader: 'graphql-import-loader' }]
      }
    ]
  },
  output: {
    filename: 'index.js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, '../../build'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js']
  },
  target: 'node',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};