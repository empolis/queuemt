const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser']
  },
  entry: './src/App.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/renderer'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000,
    publicPath: '/'
  },
  output: {
    path: path.resolve(__dirname, './dist/renderer'),
    filename: 'js/[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'QueueMT'
    })
  ]
}
