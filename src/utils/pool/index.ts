import { isGreaterThanOrEqualTo } from "@app/utils/bn";

export enum POOL_STATUS {
	LIVE = "live",
	CLOSED = "closed",
	FILLED = "filled",
	ERROR = "error",
}

export const getPoolStatus = (time: number, amount1: string, amount2: string): POOL_STATUS => {
	if (!time) return POOL_STATUS.ERROR;

	const nowTime = new Date().getTime();
	const thisTime = new Date(time * 1000).getTime();

	if (nowTime < thisTime) {
		if (amount1 && amount2 && isGreaterThanOrEqualTo(amount1, amount2)) return POOL_STATUS.FILLED;

		return POOL_STATUS.LIVE;
	} else {
		return POOL_STATUS.CLOSED;
	}
};
