export interface DateInterval {
	start?: Date;
	end?: Date;
}

export interface CalendarDay {
	disabled: boolean;
	day: number;
	date: Date;
	month: number;
	year: number;
}

export type SetDateFn = (day: Date) => any;
