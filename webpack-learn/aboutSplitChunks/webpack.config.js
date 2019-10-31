const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
console.log(process.env.NODE_ENV);
module.exports = env => {
  console.log(env);
  return {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
      main: './src/index.js',
      index2: './src/index2.js',
      index3: './src/index2.js'
      // print:'./src/print.js'
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].bundle.js'
    },
    devServer: {
      contentBase: './dist'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        /**
         * 关于chunk module bondle;
         * @module : .js文件里用import导入的就是一个module;
         * @chunk :通过以下三个方式产生的文件为chunk:
         *  1. 入口点本身算一个.
         *  2. 通过import()动态导入的文件也会生成一个chunk;
         *  3. 通过splitChunks产生的chunk
         *
         * 关于splitChunks几个值得注意的字段
         * @runtimeChunk : 用来分离webpack本身的运行时模块。此模块记录了各个chunk的映射等信息；
         * @maxInitialRequests : 最大初始化并行请求数；计算方式为。入口点产生文件本身算一个。import()动态导入生成的文件不算。只计算.js请求。不计算css请求；
         * @maxAsyncRequests : 关于动态引入模块的内部并行请求数。动态导入文件本神算一个。只计算.js请求。不计算.css请求；
         * @cacheGroups ： 所有外部的条件规则都是作用于 cacheGroups 。每个不同缓存组都可以复写外部的通用规则；
         *
         */
        chunks: 'all',
        maxInitialRequests: 5,
        maxAsyncRequests: 2,
        minSize: 2,
        minChunks: 1,
        cacheGroups: {
          async: {
            test: /async/,
            priority: -20,
            reuseExistingChunk: true
          },
          afu: {
            minSize: 7,
            test: /jsl/,
            name: 'jsl',
            priority: -15,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'output management'
      }),
      new CleanWebpackPlugin()
      // new BundleAnalyzerPlugin()
    ]
  };
};
