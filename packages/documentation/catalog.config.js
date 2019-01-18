module.exports = {
  webpack: (catalogWebpackConfig, { paths, dev, framework }) => {
    const modifiedWebpackConfig = {
      ...catalogWebpackConfig,
      module: {
        rules: [
          {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: "url-loader?limit=100000"
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          },
          {
            test: /\.md/,
            use: ["@catalog/markdown-loader", "raw-loader"]
          },
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
                plugins: [
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-proposal-export-default-from"
                ]
              }
            }
          }
        ]
      }
    };
    return modifiedWebpackConfig;
  }
};
