// Webpack version 4
const path                 = require('path');
const WebpackMd5Hash       = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin   = require('clean-webpack-plugin');

module.exports = {

  // Project entry point
  entry: {
    index: './src/index.js',
  },

  // Output directory
  output: {
    path: path.resolve( __dirname, './dist' ),
    filename: '[name].js'
  },

  externals: {
    jQuery: 'jQuery'
  },

  // Module Rules
  module: {

    rules: [
      // Javascript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      // Check first for url:() paths in SASS
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
      }, 

      // SASS, CSS..
      {
        test: /\.[s]?css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },

      // Font files
      {
         test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
         use: [{
           loader: 'file-loader',
           options: {
             name: '[name].[ext]',
             outputPath: 'fonts/',    // where the fonts will go
             publicPath: 'fonts/'     // override the default path
           }
         }]
       },
    ]
  },

  // Plugins
  plugins: [
    new CleanWebpackPlugin('dist', {}),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new WebpackMd5Hash()
  ]
  
}