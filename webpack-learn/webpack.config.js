const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
module.exports = env => {
  return {
    mode: 'production',
    optimization:{
      usedExports:true,
      sideEffects:true,
    },
    entry: {
      main: './src/index.js',
      // print:'./src/print.js'
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].bundle.js'
    },
    devServer: {
      quiet:true,
      contentBase: './dist',
      hot:true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'output management'
      }),
      new CleanWebpackPlugin(),
      // new BundleAnalyzerPlugin()
    ]
  };
};
