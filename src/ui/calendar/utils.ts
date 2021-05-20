import { CalendarDay } from "./types";

export const fillYears = (from: number, to: number) =>
	Array(to - from + 1)
		.fill(1)
		.map((x, index) => from + index);

export const stripHours = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const generateDays = (month: number, year: number): CalendarDay[] => {
	const start = new Date(year, month, 1);
	const end = new Date(year, month + 1, 0);

	const startDay = start.getDay() % 7;
	const endDay = end.getDay() % 7;

	const result: CalendarDay[] = [];

	new Array(startDay).fill(1).forEach((_, index) => {
		const day = new Date(year, month, -startDay + index + 1).getDate();

		result.push({
			disabled: true,
			day,
			month: month - 1,
			year,
			date: new Date(year, month - 1, day),
		});
	});

	new Array(end.getDate()).fill(1).forEach((_, index) => {
		const day = new Date(year, month, index + 1).getDate();

		result.push({
			disabled: false,
			day,
			month: month + 0,
			year,
			date: new Date(year, month, day),
		});
	});

	new Array(6 - endDay).fill(1).forEach((_, index) => {
		const day = new Date(year, month + 1, index + 1).getDate();

		result.push({
			disabled: true,
			day,
			month: month + 1,
			year,
			date: new Date(year, month + 1, day),
		});
	});

	if (result.length <= 7 * 5) {
		const offset = 6 - endDay + 1;

		new Array(7).fill(1).forEach((_, index) => {
			const day = new Date(year, month + 1, index + offset).getDate();

			result.push({
				disabled: true,
				day,
				month: month + 1,
				year,
				date: new Date(year, month + 1, day),
			});
		});
	}

	return result;
};

export const getYMD = (date: Date) => [date.getFullYear(), date.getMonth(), date.getDate()];
