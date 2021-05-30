import { isGreaterThanOrEqualTo } from "@app/utils/bn";
import { getDeltaTime } from "@app/utils/time";

export enum POOL_STATUS {
	COMING = "coming",
	LIVE = "live",
	CLOSED = "closed",
	FILLED = "filled",
	ERROR = "error",
}

export const getStatus = (amount, totalAmount, openAt, closeAt): POOL_STATUS => {
	const filled = isGreaterThanOrEqualTo(amount, totalAmount);
	const expired = getDeltaTime(closeAt) === 0;

	if (filled) {
		return POOL_STATUS.FILLED;
	}

	if (expired) {
		return POOL_STATUS.CLOSED;
	}

	return Date.now() < openAt * 1000 ? POOL_STATUS.COMING : POOL_STATUS.LIVE;
};
