import { ALERT_TYPE } from "@app/ui/alert";
import { isGreaterThanOrEqualTo } from "@app/utils/bn";

export const getAlertForOwner = (open: number, close: number, amount: number, total: number) => {
	const nowTime = new Date();
	const openTime = new Date(+open);
	const closeTime = new Date(+close);

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);

	const isOpen = nowTime > openTime;

	const isClose = nowTime > closeTime;

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

	if (isClose && !isFilled) {
		return {
			title: "Claim back your unswapped tokens.",
			text: "Unfortunately, your pool is not fully filled and closed.",
			type: ALERT_TYPE.error,
		};
	}
};
