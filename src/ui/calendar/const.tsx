import { LANGUAGE } from "@app/const/const";

const lang = LANGUAGE;

const shortMonthFormatter = new Intl.DateTimeFormat(lang, { month: "short" });
const monthFormatter = new Intl.DateTimeFormat(lang, { month: "long" });
const weekDayFormatter = new Intl.DateTimeFormat(lang, { weekday: "narrow" });

export const MONTHS_NAMES_SHORT = Array(12)
	.fill(1)
	.map((_, index) => shortMonthFormatter.format(new Date(2000, index)));
export const MONTHS_NAMES = Array(12)
	.fill(1)
	.map((_, index) => monthFormatter.format(new Date(2000, index)));
export const WEEKDAYS_NAMES = Array(7)
	.fill(1)
	.map((_, index) => weekDayFormatter.format(new Date(2017, 0, index + 1)));
