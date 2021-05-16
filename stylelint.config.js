module.exports = {
	extends: ["stylelint-config-standard"],
	plugins: ["stylelint-order", "stylelint-scss"],
	rules: {
		"declaration-empty-line-before": null, // breaks property groups
		"function-name-case": null, // breaks js constants
		"at-rule-no-unknown": null,
		"scss/at-rule-no-unknown": true,
		// TODO: remove me later
		"no-empty-source": null,
		"block-no-empty": null,
		"no-descending-specificity": null,
	},
};
