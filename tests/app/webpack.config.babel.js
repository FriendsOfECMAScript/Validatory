/*
 * This file is part of the Validatory package.
 *
 * Copyright (c) 2017-present Friends Of ECMAScript
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Webpack from 'webpack';
import {join} from 'path';
const path = require('path');
const include = path.resolve(__dirname);

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: include,
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include
      },
      {
        test: /\.(s?css)$/,
        loader: ExtractTextPlugin.extract({
          publicPath: '/',
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 versions']
                }),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              precision: 6
            }
          }]
        })
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin('dist/css/app.css'),
    new Webpack.LoaderOptionsPlugin({
      options: {
        sassLoader: {
          includePaths: [join(__dirname, 'src/scss')],
        }
      }
    })
  ],
};
