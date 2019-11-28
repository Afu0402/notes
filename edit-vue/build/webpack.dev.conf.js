const merge = require('webpack-merge');
const webpackBaseConf = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const webpackDevConfig = merge(webpackBaseConf,{
  mode:"development",
  devServer:{
    contentBase: './dist',
    clientLogLevel:'warning',
    disableHostCheck:true,
    compress:true,
    quiet:true,
    hot:true,
    host:"localhost",
    port:8000
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'../src/index.html'),
      inject:true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
})

module.exports = webpackDevConfig;