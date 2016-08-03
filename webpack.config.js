var webpack = require('webpack');

module.exports = {
  entry: [
    "./src/js/libs.js",
    "./src/js/scripts.js"
  ],
  output: {
    path: __dirname + "./dist/js/",
    filename: "all.js"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ]
};
