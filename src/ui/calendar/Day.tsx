import classNames from "classnames";

import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./Day.module.scss";
import { CalendarDay, DateInterval, SetDateFn } from "./types";

type DayType = {
	day: CalendarDay;
	selection?: DateInterval;
	selected?: boolean;
	empty?: boolean;
	disableEmptyDay?: boolean;
	onClick: SetDateFn;
	from?: Date;
	to?: Date;
};

const dateIsOutside = (date: Date, from: Date | undefined, to: Date | undefined): boolean => {
	if (from && +date < +from - 1) {
		return true;
	}

	if (to && +date < +to + 1) {
		return true;
	}

	return false;
};

export const Day: FC<DayType & MaybeWithClassName> = ({
	day,
	selection = {},
	selected,
	empty,
	disableEmptyDay,
	onClick,
	from,
	to,
	className,
}) => (
	<button
		className={classNames(className, styles.component, {
			[styles.disabled]: day.disabled,
			[styles.nonEmpty]: !empty,

			[styles.selected]: selected,

			[styles.intervalDisabled]: disableEmptyDay && dateIsOutside(day.date, from, to),

			[styles.outOfInterval]: dateIsOutside(day.date, from, to),

			[styles.intervalStart]: +day.date === +selection.start!,
			[styles.intervalBetween]: day.date > selection.start! && day.date < selection.end!,
			[styles.intervalEnd]: +day.date === +selection.end!,
		})}
		disabled={day.disabled || (empty && disableEmptyDay) || dateIsOutside(day.date, from, to)}
		type="button"
		onClick={() => onClick(day.date)}
	>
		<span>{day.day}</span>
	</button>
);
