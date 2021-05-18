const tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  "stories": [
    "../src/**/*.stories.tsx"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    require.resolve("./story-title/preset"),
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: {
            localIdentName: '[name]__[local]--[hash:base64:5]'
          },
        }
      }
    },
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins = [new tsConfigPathsPlugin()];
    return config;
  }
}
