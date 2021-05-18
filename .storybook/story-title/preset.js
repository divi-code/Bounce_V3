/* eslint-disable no-param-reassign */
const generateCSFTitle = require("./generate-story-title");

function babel(options = {}) {
  options.overrides = options.overrides || [];
  options.overrides.push({
    test: /\.stories\.tsx?/,
    plugins: [[require.resolve("babel-plugin-storybook-csf-title"), { toTitle: generateCSFTitle, seed: 5 }]],
  });
  return options;
}

module.exports = { babel };
