import classNames from "classnames";
import { FC, SVGAttributes, useCallback, useEffect, useRef, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./Calendar.module.scss";
import { DayPanelHead } from "./DayPanelHead";

import { DayPanel } from "./Days";
import { MONTHS_NAMES } from "./const";
import { DateInterval } from "./types";
import { getYMD } from "./utils";

const minDateOfTwo = (d1: Date, d2: Date) => (d1 < d2 ? d1 : d2);

type QuickNavType = "today" | "tomorrow" | "in-2-days" | "in-5-days" | "in-7-days" | "in-10-days";

interface Props {
	quickNav?: Array<QuickNavType>;
	label: string;
	value?: Date;
	selection?: DateInterval;
	minDate?: Date;
	maxDate?: Date;
	dayFill?: Record<number, number | boolean>;
	disableEmptyDays?: boolean;
	style?: any;
	gap?: string;
	onChange(newDate: Date): void;
}

const Switch = (props: SVGAttributes<SVGElement>) => (
	<svg viewBox="0 0 7 12" fill="currentColor" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7 10.59L2.673 6 7 1.41 5.668 0 0 6l5.668 6L7 10.59z"
		/>
	</svg>
);

export const Calendar: FC<Props & MaybeWithClassName> = ({
	className,
	label,
	quickNav,
	selection,
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

	const setToday = () => {
		const newDate = new Date();
		setCalendarValue(newDate);
		pickDate(newDate);
	};

	const setInXDays = (x: number) => {
		const newDate = new Date(Date.now() + x * 24 * 60 * 60 * 1000);
		setCalendarValue(newDate);
		pickDate(newDate);
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

	return (
		<div className={classNames(className, styles.component)} style={{ ...style, "--gap": gap }}>
			<div className={styles.navigation}>
				{label}
				{quickNav && quickNav.includes("today") && (
					<button className={styles.control} onClick={setToday}>
						Today
					</button>
				)}
				{quickNav && quickNav.includes("tomorrow") && (
					<button className={styles.control} onClick={() => setInXDays(1)}>
						Tomorrow
					</button>
				)}
				{quickNav && quickNav.includes("in-2-days") && (
					<button className={styles.control} onClick={() => setInXDays(2)}>
						In 2 days
					</button>
				)}
				{quickNav && quickNav.includes("in-5-days") && (
					<button className={styles.control} onClick={() => setInXDays(5)}>
						In 5 days
					</button>
				)}
				{quickNav && quickNav.includes("in-7-days") && (
					<button className={styles.control} onClick={() => setInXDays(7)}>
						In 7 days
					</button>
				)}
				{quickNav && quickNav.includes("in-10-days") && (
					<button className={styles.control} onClick={() => setInXDays(10)}>
						In 10 days
					</button>
				)}
			</div>
			<div className={styles.control}>
				<button className={styles.switch} onClick={moveLeft}>
					<span>Prev</span>
					<Switch />
				</button>
				<button className={styles.toggle} onClick={toggleMonthPicker}>
					{MONTHS_NAMES[month]} {year}
				</button>
				<button className={styles.toggle} onClick={toggleMonthPicker}>
					{MONTHS_NAMES[month + 1]} {year}
				</button>
				<button className={styles.switch} onClick={moveRight}>
					<span>Next</span>
					<Switch style={{ transform: "rotate(180deg)" }} />
				</button>
			</div>
			<div className={styles.content} tabIndex={-1} ref={contentRef}>
				<div>
					<DayPanelHead className={styles.head} />
					<DayPanel
						day={day}
						month={month}
						year={year}
						selection={selection}
						pickDate={pickDate}
						from={minDate}
						to={maxDate}
						dayFill={dayFill}
						disableEmptyDay={disableEmptyDays}
					/>
				</div>
				<div>
					<DayPanelHead className={styles.head} />
					<DayPanel
						month={month + 1}
						year={year}
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
