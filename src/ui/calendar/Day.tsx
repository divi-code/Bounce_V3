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

export const Day: FC<DayType & MaybeWithClassName> = ({
	day,
	selection,
	selected,
	empty,
	disableEmptyDay,
	onClick,
	from,
	to,
	className,
}) => (
	<button
		className={classNames(
			className,
			styles.component,

			day.disabled && styles.disabled,
			!empty && styles.nonEmpty,

			selected && styles.selected,

			disableEmptyDay &&
				((from && day.date < from) || (to && day.date > to)) &&
				styles.intervalDisabled,

			((from && day.date < from) || (to && day.date > to)) && styles.outOfInterval
		)}
		disabled={day.disabled || (empty && disableEmptyDay)}
		type="button"
		onClick={() => onClick(day.date)}
	>
		{day.day}
	</button>
);
