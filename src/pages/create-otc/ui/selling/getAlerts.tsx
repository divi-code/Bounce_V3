import { ALERT_TYPE } from "@app/ui/alert";

export const getAlert = (fromToken: string, toToken: string) => {
	const isTokensDifferent = fromToken !== toToken;

	if (!isTokensDifferent) {
		return {
			title: "",
			text: "Bounce protocol does not support inflationary and deflationary tokens.",
			type: ALERT_TYPE.warning,
		};
	}
};
