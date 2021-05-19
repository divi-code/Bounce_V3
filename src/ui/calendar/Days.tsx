import ClassNames from "classnames";
import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Day } from "./Day";
import styles from "./Days.module.scss";
import { CalendarDay, DateInterval, SetDateFn } from "./types";
import { generateDays } from "./utils";

type DaysType = {
	selection?: DateInterval;
	day?: number;
	month?: number;
	pickDate: SetDateFn;
	from?: Date;
	to?: Date;
	dayFill?: Record<number, number | boolean>;
	disableEmptyDay?: boolean;
};

export const DayPanelImpl: FC<DaysType & MaybeWithClassName & { days: CalendarDay[] }> = ({
	days,
	selection,
	dayFill,
	day,
	month,
	pickDate,
	from,
	to,
	disableEmptyDay,
	className,
}) => (
	<div className={ClassNames(className, styles.component)}>
		<ol className={styles.list}>
			{days.map((currentDay) => (
				<li className={styles.item} key={`${month}${currentDay.date}`}>
					<Day
						className={styles.day}
						day={currentDay}
						selection={selection}
						onClick={pickDate}
						from={from}
						to={to}
						selected={currentDay.day === day}
						disableEmptyDay={disableEmptyDay}
						empty={dayFill && !dayFill[+currentDay.date]}
					/>
				</li>
			))}
		</ol>
	</div>
);

export const DayPanel: FC<DaysType & MaybeWithClassName & { year?: number }> = ({
	day,
	month,
	year,
	selection,
	pickDate,
	from,
	to,
	dayFill,
	disableEmptyDay,
	className,
}) => (
	<DayPanelImpl
		days={generateDays(month, year)}
		selection={selection}
		pickDate={pickDate}
		day={day}
		month={month}
		// year={year}
		from={from}
		to={to}
		dayFill={dayFill}
		disableEmptyDay={disableEmptyDay}
		className={className}
	/>
);
