import BigNumber from "bignumber.js";

export const toWei = (value: number, decimals) => {
	return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
};

export const fromWei = (value: string, decimals = 18) => {
	return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};

export const weiToNum = (value: string, decimals = 18, fixed = 6) => {
	return new BigNumber(fromWei(value, decimals).toFixed(fixed === -1 ? null : fixed, 1))
		.toNumber()
		.toString();
};

export const numToWei = (value: number, decimals = 18, fixed = 6) => {
	return toWei(value, decimals).toFixed(fixed, 1).toString();
};
