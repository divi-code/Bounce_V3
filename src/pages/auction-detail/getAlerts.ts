import { ALERT_TYPE } from "@app/ui/alert";
import { isGreaterThanOrEqualTo } from "@app/utils/bn";

export const getAlertForOwner = (open: string, close: string, amount: string, total: string) => {
	const nowTime = new Date();
	const openTime = new Date(+open * 1000);
	const closeTime = new Date(+close * 1000);

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);

	if (nowTime > openTime) {
		if (nowTime < closeTime) {
			if (isFilled)
				return {
					title: "All Tokens Auctioned.",
					text:
						"Congratulations! Your auction is complete. All your tokens are auctioned and your fund is automatically sent to your wallet.",
					type: ALERT_TYPE.success,
				};

			return {
				title: "The auction is still live.",
				text: "Please wait patiently until your auction is filled or closed.",
				type: ALERT_TYPE.default,
			};
		} else {
			if (isFilled)
				return {
					title: "The auction is closed.",
					text: "All your tokens are auctioned and your fund is automatically sent to your wallet.",
					type: ALERT_TYPE.success,
				};

			return {
				title: "Claim back your unswapped tokens.",
				text: "Unfortunately, your pool is not fully filled and closed.",
				type: ALERT_TYPE.error,
			};
		}
	} else {
		return {
			title: "The auction is coming soon.",
			text: "Please wait patiently until your auction is filled or closed.",
			type: ALERT_TYPE.default,
		};
	}
};
