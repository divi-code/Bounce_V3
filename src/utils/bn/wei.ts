import BigNumber from "bignumber.js";

export const fromWei = (value, decimals = 18) => {
	return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};

export const weiToNum = (value, decimals = 18, fixed = 6) => {
	return new BigNumber(fromWei(value, decimals).toFixed(fixed === -1 ? null : fixed))
		.toNumber()
		.toString();
};
