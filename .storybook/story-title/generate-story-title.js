const { dirname, basename, parse, relative, sep } = require("path");
const pkgUp = require('pkg-up');
/**
 * generates a storyname for babel-plugin-storybook-csf-title
 */
module.exports = (state) => {
	// find the closest package.json
	const packageJsonPath = pkgUp.sync({ cwd: state.filename });

	// read the package.json
	// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
	const packageJson = require(packageJsonPath);

	// get the path of the story file relative to the package root
	const { dir: packageJsonDir } = parse(packageJsonPath);
	const { dir: fileDir } = parse(relative(packageJsonDir, state.filename));

	const kind = basename(dirname(packageJsonDir));

	const storyPath = fileDir.split(sep).filter((dir) => dir !== "src");

	const storybookPath = [
		kind,
		packageJson.name,
		// file dir
		...storyPath,
	].filter(Boolean);

	return storybookPath.join("/");
};
