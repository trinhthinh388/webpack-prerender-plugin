/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { NODE_ENV } = process.env;

module.exports = {
  mode: NODE_ENV,
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js',
  },
  devServer: {
    port: 3030,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i, // styles files
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|gif|mp4)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', // to import index.html file inside index.js
    }),
    new MiniCssExtractPlugin(),
  ],
};
