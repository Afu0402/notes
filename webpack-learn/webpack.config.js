const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry:{
    main:'./src/index.js'
    // print:'./src/print.js'
  },
  output:{
    filename: '[name].[hash].js',
    path: path.resolve(__dirname,'dist'),
    chunkFilename:'[name].bundle.js'
  },
  devServer:{
    contentBase:'./dist'
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  // optimization:{
  //   splitChunks:{
  //     chunks:'all'
  //   }
  // },
  plugins:[
    new HtmlWebpackPlugin({
      title: 'output management'
    }),
    new CleanWebpackPlugin()
  ]
}
