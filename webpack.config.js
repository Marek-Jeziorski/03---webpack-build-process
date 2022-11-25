const path = require("path");
const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];
module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  entry: {
    bundle: path.resolve(__dirname, "app/assets/scripts/App.js"),
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    static: "./dist",
    port: 3000,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: postCSSPlugins } },
          },
        ],
      },
    ],
  },
};
