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
	totalAmount: string
): POOL_STATUS => {
	const nowTime = new Date();
	const openTime = new Date(+openAt * 1000);
	const closeTime = new Date(+closeAt * 1000);

	if (nowTime > openTime) {
		if (nowTime < closeTime) {
			if (amount && totalAmount && isGreaterThanOrEqualTo(amount, totalAmount))
				return POOL_STATUS.FILLED;

			return POOL_STATUS.LIVE;
		} else {
			return POOL_STATUS.CLOSED;
		}
	} else {
		return POOL_STATUS.COMING;
	}
};

export const getProgress = (amount, totalAmount) => +divide(amount, totalAmount, 0);

export const getSwapRatio = (
	fromAmount: string,
	toAmount: string,
	fromDecimals: number,
	toDecimals: number
): string => {
	const from = weiToNum(fromAmount, fromDecimals);
	const to = weiToNum(toAmount, toDecimals);

	return divide(from, to, 2);
};
