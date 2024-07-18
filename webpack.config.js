const webpack = require("webpack");

const path = require("path");

module.exports = {
  mode: "none",
  entry: {
    app: path.join(__dirname, "src/page/MainPage2.tsx")
  },
  target: "web",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      process: "process/browser.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/"
      }
    ]
  },
  output: {
    filename: "MMM-TeslamateLocation2.js",
    path: path.resolve(__dirname)
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser.js"
    })
  ]
};
