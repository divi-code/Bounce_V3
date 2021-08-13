import { ALERT_TYPE } from "@app/ui/alert";
import { isGreaterThanOrEqualTo } from "@app/utils/bn";
import { isEqualZero } from "@app/utils/validation";

export const getAlertForOwner = (
	open: number,
	close: number,
	amount: number,
	total: number,
	claimed: boolean
) => {
	const nowTime = new Date();
	const openTime = new Date(+open);
	const closeTime = new Date(+close);

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);

	const isOpen = nowTime > openTime;

	const isClose = nowTime > closeTime;

	const isClaimed = claimed;

	if (!isOpen) {
		return {
			title: "The auction is coming soon.",
			text: "Please wait patiently until your auction is filled or closed.",
			type: ALERT_TYPE.default,
		};
	}

	if (isOpen && !isClose && !isFilled) {
		return {
			title: "The auction is still live.",
			text: "Please wait patiently until your auction is filled or closed.",
			type: ALERT_TYPE.default,
		};
	}

	if (isOpen && !isClose && isFilled) {
		return {
			title: "All Tokens Auctioned.",
			text:
				"Congratulations! Your auction is complete. All your tokens are auctioned and your fund is automatically sent to your wallet.",
			type: ALERT_TYPE.success,
		};
	}

	if (isClose && isFilled) {
		return {
			title: "The auction is closed.",
			text: "All your tokens are auctioned and your fund is automatically sent to your wallet.",
			type: ALERT_TYPE.success,
		};
	}

	if (isClose && !isFilled && !isClaimed) {
		return {
			title: "Claim back your unswapped tokens.",
			text: "Unfortunately, your pool is not fully filled and closed.",
			type: ALERT_TYPE.error,
		};
	}

	if (isClose && !isFilled && isClaimed) {
		return {
			title: "The auction is closed.",
			text: "Unfortunately, your pool is not fully filled and closed.",
			type: ALERT_TYPE.error,
		};
	}
};

export const getAlertForUsers = (
	whitelisted: boolean,
	open: number,
	close: number,
	amount: number,
	total: number,
	placed: boolean,
	claimed: boolean,
	claimAt: number
) => {
	const nowTime = new Date();
	const openTime = new Date(+open);
	const closeTime = new Date(+close);

	const isOpen = nowTime > openTime;
	const isClose = nowTime > closeTime;
	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);
	const isPlaced = placed;
	const isClaimed = claimed;
	const isLockout = !(claimAt === 0);

	if (!whitelisted) {
		return {
			title: "Oops.",
			text: "You are not whitelisted",
			type: ALERT_TYPE.error,
		};
	} else {
		if (isOpen && !isClose && isPlaced && !isFilled && !isLockout) {
			return {
				title: "Bidded Tokens Sent.",
				text:
					"You have successfully bidded and your swapped tokens are automatically sent to your wallet. You can now make more bids.",
				type: ALERT_TYPE.success,
			};
		}

		if (isOpen && !isClose && isPlaced && !isFilled && isLockout) {
			return {
				title: "Tokens Bidded.",
				text:
					"You have successfully bidded. You can claim your bidded tokens once they are unlocked.",
				type: ALERT_TYPE.success,
			};
		}

		if (isOpen && !isClose && isFilled && !isPlaced) {
			return {
				title: "Auction filled.",
				text: "This auction is finished, please visit other live auctions.",
				type: ALERT_TYPE.default,
			};
		}

		if (isOpen && !isClose && isFilled && isPlaced && !isClaimed) {
			if (isLockout) {
				return {
					title: "Auction filled.",
					text: "This auction is finished, please claim your token once they are unlocked.",
					type: ALERT_TYPE.default,
				};
			} else {
				return {
					title: "Auction filled.",
					text:
						"This auction is finished, You have successfully bidded and your swapped tokens are automatically sent to your wallet.",
					type: ALERT_TYPE.default,
				};
			}
		}

		if (isOpen && !isClose && isFilled && isPlaced && isClaimed) {
			return {
				title: "Auction filled.",
				text: "This auction is finished",
				type: ALERT_TYPE.default,
			};
		}

		if (isClose && isFilled && !isPlaced) {
			return {
				title: "Auction filled.",
				text: "This auction is finished, please visit other live auctions.",
				type: ALERT_TYPE.default,
			};
		}

		if (isClose && isFilled && isPlaced && !isClaimed) {
			if (isLockout) {
				return {
					title: "Auction closed.",
					text: "This auction is finished, please claim your token once they are unlocked.",
					type: ALERT_TYPE.default,
				};
			} else {
				return {
					title: "Auction closed.",
					text:
						"This auction is finished, You have successfully bidded and your swapped tokens are automatically sent to your wallet.",
					type: ALERT_TYPE.default,
				};
			}
		}

		if (isClose && isFilled && isPlaced && isClaimed) {
			return {
				title: "Auction filled.",
				text: "This auction is finished",
				type: ALERT_TYPE.default,
			};
		}

		if (isClose && !isFilled && !isPlaced) {
			return {
				title: "Auction closed.",
				text: "This auction is finished, please visit other live auctions.",
				type: ALERT_TYPE.default,
			};
		}

		if (isClose && !isFilled && isPlaced && !isClaimed) {
			return {
				title: "Auction closed.",
				text: "This auction is finished, please claim your token.",
				type: ALERT_TYPE.default,
			};
		}

		if (isClose && !isFilled && isPlaced && isClaimed) {
			return {
				title: "Auction closed.",
				text: "This auction is finished",
				type: ALERT_TYPE.default,
			};
		}
	}
};
