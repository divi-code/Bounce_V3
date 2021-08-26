// eslint-disable-next-line @typescript-eslint/no-var-requires
const withImages = require("next-images");

module.exports = {
	...withImages(),
	distDir: "dist",

	// optional
	// lessVarsFilePath: "./src/styles/variables.less",
	// optional
	// lessVarsFilePathAppendToEndOfContent: false,
	// optional https://github.com/webpack-contrib/css-loader#object
	cssLoaderOptions: {},

	webpack(config) {
		return config;
	},

	future: {
		webpack5: true,
	},
};
