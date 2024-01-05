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
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
