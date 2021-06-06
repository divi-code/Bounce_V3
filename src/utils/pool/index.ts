import { divide, isGreaterThanOrEqualTo } from "@app/utils/bn";
import { weiToNum } from "@app/utils/bn/wei";

export enum POOL_STATUS {
	COMING = "coming",
	LIVE = "live",
	CLOSED = "closed",
	FILLED = "filled",
	ERROR = "error",
}

export const getStatus = (
	openAt: string | number,
	closeAt: string | number,
	amount: string,
	total: string
): POOL_STATUS => {
	const nowTime = new Date();
	const openTime = new Date(+openAt);
	const closeTime = new Date(+closeAt);

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);

	const isOpen = nowTime > openTime;

	const isClose = nowTime > closeTime;

	if (!isOpen) {
		return POOL_STATUS.COMING;
	}

	if (isOpen && !isClose && !isFilled) {
		return POOL_STATUS.LIVE;
	}

	if (isOpen && !isClose && isFilled) {
		return POOL_STATUS.FILLED;
	}

	if (isClose && !isFilled) {
		return POOL_STATUS.CLOSED;
	}

	if (isClose && isFilled) {
		return POOL_STATUS.FILLED;
	}
};

export const getProgress = (amount: string, total: string, decimals: number): number => {
	const convertedAmount = weiToNum(amount, decimals);
	const convertedTotal = weiToNum(total, decimals);

	return parseFloat(divide(convertedAmount, convertedTotal, 2)) * 100;
};

export const getSwapRatio = (
	fromAmount: string,
	toAmount: string,
	fromDecimals: number,
	toDecimals: number
): string => {
	const from = weiToNum(fromAmount, fromDecimals, 6);
	const to = weiToNum(toAmount, toDecimals, 6);

	return divide(from, to, 6);
};
