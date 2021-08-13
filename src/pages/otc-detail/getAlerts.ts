import { ALERT_TYPE } from "@app/ui/alert";
import { isGreaterThanOrEqualTo } from "@app/utils/bn";
import { POOL_STATUS } from "@app/utils/pool";

export const getAlertForOwner = (
	open: number,
	amount: number,
	total: number,
	poolStatus: POOL_STATUS
) => {
	const nowTime = new Date();
	const openTime = new Date(+open);
	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);
	const isOpen = nowTime > openTime;
	const isClose = poolStatus === POOL_STATUS.CLOSED;

	if (!isOpen) {
		return {
			title: "The auction is coming soon.",
			text: "Please wait patiently until your auction is filled or closed.",
			type: ALERT_TYPE.default,
		};
	}

	if (isClose) {
		return undefined;
	}

	if (isOpen && !isFilled) {
		return {
			title: "The auction is still live.",
			text: "Please wait patiently until your auction is filled or closed.",
			type: ALERT_TYPE.default,
		};
	}

	if (isOpen && isFilled) {
		return {
			title: "All Tokens Auctioned.",
			text:
				"Congratulations! Your auction is complete. All your tokens are auctioned and your fund is automatically sent to your wallet.",
			type: ALERT_TYPE.success,
		};
	}
};

export const getAlertForUsers = (
	whitelisted: boolean,
	open: number,
	amount: number,
	total: number,
	placed: boolean
) => {
	const nowTime = new Date();
	const openTime = new Date(+open);

	const isOpen = nowTime > openTime;

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);
	const isPlaced = placed;

	if (!whitelisted) {
		return {
			title: "Oops.",
			text: "You are not whitelisted",
			type: ALERT_TYPE.error,
		};
	} else {
		if (isOpen && isPlaced && !isFilled) {
			return {
				title: "OTC tokens sent.",
				text:
					"You have successfully OTC and your swapped tokens are automatically sent to your wallet. You can now make more swaps.",
				type: ALERT_TYPE.success,
			};
		}

		if (isOpen && isPlaced && isFilled) {
			return {
				title: "OTC closed.",
				text:
					"This OTC is finished. All your swapped tokens are automatically sent to your wallet.",
				type: ALERT_TYPE.default,
			};
		}

		if (isOpen && isFilled && !isPlaced) {
			return {
				title: "OTC closed.",
				text: "This OTC is finished, please visit other live OTC.",
				type: ALERT_TYPE.default,
			};
		}
	}
};
