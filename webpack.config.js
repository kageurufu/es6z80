var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname),
    filename: 'es6z80.dist.js'
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: ["babel-loader"]},
      {test: /\.(bin|gb)$/, loader: ['binary-loader']},
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ES6Z80',
      template: 'templates/index.ejs'
    }),
  ]
};