import { LANGUAGE } from "@app/const/const";

const pickDateFormat = (format: "long" | "short"): Intl.DateTimeFormatOptions => {
	switch (format) {
		case "short":
			return {
				year: "2-digit",
				day: "2-digit",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			} as const;
		case "long":
			return {
				year: "numeric",
				day: "2-digit",
				month: "long",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			};
		default:
			return pickDateFormat("long");
	}
};

export const useConvertDate = () => (date: Date, format: "long" | "short") => {
	try {
		return Intl.DateTimeFormat(LANGUAGE, pickDateFormat(format)).format(date);
	} catch (e) {
		console.error(e);

		return "InvalidDate";
	}
};
