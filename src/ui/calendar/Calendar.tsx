import classNames from "classnames";
import { FC, SVGAttributes, useCallback, useEffect, useRef, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Button } from "@app/ui/button";

import styles from "./Calendar.module.scss";
import { DayPanelHead } from "./DayPanelHead";

import { DayPanel } from "./Days";
import { MONTHS_NAMES } from "./const";
import { DateInterval } from "./types";
import { getYMD } from "./utils";

const minDateOfTwo = (d1: Date, d2: Date) => (d1 < d2 ? d1 : d2);

interface Props {
	value?: Date;
	selection?: DateInterval;
	selected?: Date;
	minDate?: Date;
	maxDate?: Date;
	dayFill?: Record<number, number | boolean>;
	disableEmptyDays?: boolean;
	style?: any;
	gap?: string;
	onChange(newDate: Date): void;
}

const Switch = (props: SVGAttributes<SVGElement>) => (
	<svg
		width={9}
		height={14}
		viewBox="0 0 9 14"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M8 1L2 7l6 6" stroke="currentColor" strokeWidth={2} />
	</svg>
);

export const Calendar: FC<Props & MaybeWithClassName> = ({
	className,
	selection,
	selected,
	minDate,
	maxDate,
	value,
	onChange,
	dayFill,
	disableEmptyDays,
	style,
	gap,
}) => {
	const targetDate = value || minDateOfTwo(maxDate || new Date(), new Date());
	const [y, m, d] = getYMD(targetDate);
	const [year, setYear] = useState(y);
	const [month, setMonth] = useState(m);
	const [day, setDay] = useState(d);

	const [calendarValue, setCalendarValue] = useState(value);

	const pickDate = useCallback(
		(newDate) => {
			onChange(newDate);
		},
		[onChange]
	);

	// sync
	useEffect(() => {
		// tslint:disable-next-line:no-shadowed-variable
		const [y, m, d] = getYMD(targetDate);
		setYear(y);
		setMonth(m);
		setDay(d);
	}, [+calendarValue!]);

	useEffect(() => setCalendarValue(value), [+value!]);

	const contentRef = useRef<HTMLDivElement>(null);

	const toggleMonthPicker = () => {
		contentRef.current && contentRef.current.focus();
	};

	const moveLeft = () => {
		if (month > 0) {
			setMonth(month - 1);
		} else {
			setMonth(11);
			setYear(year - 1);
		}
	};

	const moveRight = () => {
		if (month < 11) {
			setMonth(month + 1);
		} else {
			setMonth(0);
			setYear(year + 1);
		}
	};

	const [secondMonth, setSecondMonth] = useState(month + 1);
	const [secondYear, setSecondYear] = useState(year);

	useEffect(() => {
		if (month < 11) {
			setSecondMonth(month + 1);
			setSecondYear(year);
		} else {
			setSecondMonth(0);
			setSecondYear(year + 1);
		}
	}, [month, year]);

	return (
		<div className={classNames(className, styles.component)} style={{ ...style, "--gap": gap }}>
			<div className={styles.month}>
				<Button
					className={classNames(styles.switch, styles.prev)}
					onClick={moveLeft}
					icon={<Switch />}
					color="primary-black"
					variant="text"
				>
					Prev
				</Button>
				<Button
					className={styles.monthDisplay}
					color="primary-black"
					variant="text"
					size="large"
					weight="bold"
					onClick={toggleMonthPicker}
				>
					{MONTHS_NAMES[month]} {year}
				</Button>
				<Button
					className={styles.monthDisplay}
					color="primary-black"
					variant="text"
					size="large"
					weight="bold"
					onClick={toggleMonthPicker}
				>
					{MONTHS_NAMES[secondMonth]} {secondYear}
				</Button>
				<Button
					className={classNames(styles.switch, styles.next)}
					onClick={moveRight}
					icon={<Switch style={{ transform: "rotate(180deg)" }} />}
					color="primary-black"
					variant="text"
				>
					Next
				</Button>
			</div>
			<div className={styles.content} tabIndex={-1} ref={contentRef}>
				<div>
					<DayPanelHead className={styles.titles} />
					<DayPanel
						day={day}
						month={month}
						year={year}
						selection={selection}
						selected={selected}
						pickDate={pickDate}
						from={minDate}
						to={maxDate}
						dayFill={dayFill}
						disableEmptyDay={disableEmptyDays}
					/>
				</div>
				<div>
					<DayPanelHead className={styles.titles} />
					<DayPanel
						month={secondMonth}
						year={secondYear}
						selection={selection}
						pickDate={pickDate}
						from={minDate}
						to={maxDate}
						dayFill={dayFill}
						disableEmptyDay={disableEmptyDays}
					/>
				</div>
			</div>
		</div>
	);
};
