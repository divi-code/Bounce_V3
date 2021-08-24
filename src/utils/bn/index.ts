import BigNumber from "bignumber.js";

type Numeric = string | number;

export const isGreaterThan = (value1: Numeric, value2: Numeric): boolean => {
	return new BigNumber(value1).isGreaterThan(new BigNumber(value2));
};

export const isGreaterThanOrEqualTo = (value1: Numeric, value2: Numeric): boolean => {
	return new BigNumber(value1).isGreaterThanOrEqualTo(new BigNumber(value2));
};

export const isLessThan = (value1: Numeric, value2: Numeric): boolean => {
	return new BigNumber(value1).isLessThan(new BigNumber(value2));
};

export const isLessThanOrEqualTo = (value1: Numeric, value2: Numeric): boolean => {
	return new BigNumber(value1).isLessThanOrEqualTo(new BigNumber(value2));
};

export const isEqualTo = (value1: Numeric, value2: Numeric): boolean => {
	return new BigNumber(value1).isEqualTo(new BigNumber(value2));
};

export const divide = (value1: Numeric, value2: Numeric, fixed = 6): string => {
	return new BigNumber(
		new BigNumber(value1).dividedBy(new BigNumber(value2)).toFixed(fixed, 1)
	).toString();
};

export const roundedDivide = (value1: Numeric, value2: Numeric, fixed = 6): string => {
	return new BigNumber(
		new BigNumber(value1).dividedBy(new BigNumber(value2)).toFixed(fixed)
	).toString();
};

export const roundedMultiplied = (value1: Numeric, value2: Numeric, fixed = 6): string => {
	return new BigNumber(
		new BigNumber(value1).multipliedBy(new BigNumber(value2)).toFixed(fixed)
	).toString();
};
