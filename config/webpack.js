var path = require('path');
var webpack = require('webpack');

module.exports = {  
  entry: path.resolve(__dirname, '../src/client/scripts/client.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
        {
            presets:['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
    //new webpack.optimize.UglifyJsPlugin({ sourceMap: false })
  ],
  externals: {
      //don't bundle the 'react' npm package with our bundle.js
      //but get it from a global 'React' variable
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-router': 'ReactRouter',
      'reflux': 'Reflux'
      //'react-bootstrap':'ReactBootstrap'
      //'react-notificaion-system': 'NotificationSystem',
  },
  resolve: {
      extensions: ['', '.js', '.jsx']
  }
};