const currentTask = process.env.npm_lifecycle_event;
console.log(currentTask);

const path = require("path");
const postCSSPlugins = [
  require("postcss-mixins"),
  require("postcss-import"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

let config = {
  entry: {
    bundle: path.resolve(__dirname, "app/assets/scripts/App.js"),
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

if (currentTask == "dev") {
  config.output = {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  };

  config.devServer = {
    static: "./dist",
    port: 3000,
  };

  config.mode = "development";
}

if (currentTask == "build") {
  config.output = {
    filename: "bundle.js",
    path: path.resolve(__dirname, "docs"),
  };

  config.mode = "production";
}

module.exports = config;
