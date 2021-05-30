import { isGreaterThanOrEqualTo } from "@app/utils/bn";

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
	const openTime = new Date(+openAt);
	const closeTime = new Date(+closeAt);

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
