import { LANGUAGE } from "@app/const/const";

const currentLanguage = LANGUAGE;

const toFixed = (n: number, s: string) =>
	`${Array(Math.max(0, n - s.length))
		.fill(0)
		.join("")}${s}`;

export const to2Digit = (s: number | string) => toFixed(2, String(s));

export const to2DigitOrNothing = (s: number | string) => (!s || !+s ? "" : toFixed(2, String(s)));

export const getDateFormatter = (options: Intl.DateTimeFormatOptions) =>
	new Intl.DateTimeFormat(currentLanguage, options);

export const dateToISOTime = (date: Date) =>
	`${to2Digit(date.getHours())}:${to2Digit(date.getMinutes())}:${to2Digit(date.getSeconds())}`;

export const dateToISODate = (date: Date) =>
	`${date.getFullYear()}-${to2Digit(date.getMonth() + 1)}-${to2Digit(date.getDate())}`;

export const ISODateToDate = (isoDate: string) => new Date(isoDate);

export const getDateOrder = () => {
	const formatter = getDateFormatter({ month: "numeric", year: "numeric", day: "numeric" });
	const date = formatter.format(new Date(2222, 11, 30));

	return {
		year: date.indexOf("2222"),
		month: date.indexOf("12"),
		day: date.indexOf("30"),
	};
};

export const endOfTheDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, -1);
