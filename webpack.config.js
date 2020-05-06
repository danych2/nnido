const path = require('path');

module.exports = {
  entry: {
    home: './superg/frontend/src/home.js',
  },
  output: {
    path: path.resolve(__dirname, "superg/frontend/static/frontend"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}
