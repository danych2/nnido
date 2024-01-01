const path = require('path');

module.exports = {
  entry: {
    home: './frontend/src/home.js',
  },
  output: {
    path: path.resolve(__dirname, 'frontend/static/frontend'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
