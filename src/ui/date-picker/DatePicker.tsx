/* eslint-disable no-var */
import classNames from "classnames";

import React, { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
import { CSSProperties } from "react";
import { useCallbackState } from "use-callback-state";

import { MaybeWithClassName } from "@app/helper/react/types";

import { useOnClickOutside } from "@app/hooks/use-click-outside";
import { useOpenControl } from "@app/hooks/use-field-control";
import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { Button } from "@app/ui/button";
import { DateInterval } from "@app/ui/calendar/types";
import { FieldFrame } from "@app/ui/field-frame";
import { Input } from "@app/ui/input";
import { Body1 } from "@app/ui/typography";
import { dateToISODate, endOfTheDay, to2DigitOrNothing } from "@app/ui/utils/dateFormatter";

import { Calendar, QuickNavType } from "../calendar";

import styles from "./DatePicker.module.scss";

const isFinite = (a: string) => !isNaN(+a);

const getMaxDay = (date?: Date) =>
	date ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() : 31;

const Icon = (props) => (
	<svg
		width={20}
		height={20}
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M17.367 2.753h-2.705V1.232a.701.701 0 00-1.401 0v1.521H6.739V1.232a.701.701 0 00-1.4 0v1.521H2.632A2.639 2.639 0 000 5.386v11.45a2.639 2.639 0 002.633 2.632h14.734A2.639 2.639 0 0020 16.836V5.386a2.64 2.64 0 00-2.633-2.633zM2.633 4.154h2.705v.484a.701.701 0 001.401 0v-.484h6.498v.484a.701.701 0 001.4 0v-.484h2.706c.676 0 1.232.556 1.232 1.232V7.73H1.4V5.386c0-.676.556-1.232 1.232-1.232zm14.734 13.913H2.633A1.237 1.237 0 011.4 16.836V9.154h17.198v7.682c0 .676-.555 1.232-1.232 1.232z"
			fill="#000"
		/>
	</svg>
);

export type DropdownPositionType = "left" | "right";

type DatePickerType = {
	initialValue?: Date;
	min?: string;
	max?: string;
	name: string;
	placeholder?: string;
	dayFill?: Record<number, number | boolean>;
	selection?: DateInterval;
	noIntervalValidate?: boolean;
	labels: string[];
	dropdownWidth?: string;
	quickNav?: Array<QuickNavType>;
	dropdownPosition?: DropdownPositionType;
	onChange(date: Date): void;
	onBlur?(): void;
	readOnly?: boolean;
	required?: boolean;
	error?: string;
};

const testMinMax = (value: string, min?: number, max?: number) =>
	!value || !+value || ((!min || +value >= min) && (!max || +value <= max));

const YEAR_OFFSET = 2000;
const MONTH_OFFSET = -1;

const useDateState = (
	value: string,
	min: number,
	max: number,
	dateParts: [string, string, string],
	factorParts: [number, number, number],
	set: (n: Date) => boolean
) =>
	useCallbackState(value, (newValue, oldValue) => {
		if (testMinMax(newValue, min, max)) {
			if (newValue && isFinite(newValue) && dateParts.every(Boolean)) {
				const numeric = +newValue;
				const newDate = new Date(
					+dateParts[0] + factorParts[0] * numeric + YEAR_OFFSET,
					+dateParts[1] + factorParts[1] * numeric + MONTH_OFFSET,
					+dateParts[2] + factorParts[2] * numeric
				);

				if (!set(newDate)) {
					return oldValue;
				}

				return newValue ? String(+newValue) : newValue;
			}

			return oldValue;
		}
	});

const asTwoDigitNumber = (value: string | number) => {
	const fixedNumber = typeof value === "string" ? parseFloat(value) : value;

	if (fixedNumber >= 10) return fixedNumber;
	else return `0${fixedNumber}`;
};

export const DatePicker: FC<DatePickerType & MaybeWithClassName> = ({
	name,
	initialValue,
	min,
	max,
	dayFill,
	selection,
	onChange,
	onBlur,
	placeholder,
	noIntervalValidate,
	className,
	labels,
	dropdownWidth = "100%",
	dropdownPosition = "left",
	quickNav,
	readOnly,
	required,
	error,
}) => {
	const [calendarRef, setCalendarRef] = useState<HTMLElement | null>(null);

	const [calendarHeight, setCalendarHeight] = useState(0);
	useResizeObserver(calendarRef, (ref) => setCalendarHeight(ref.clientHeight));

	const [on, open, close, toggle] = useOpenControl();

	//click outside: close
	const closeByClickAway = useCallback(() => {
		if (on) {
			close();
		}
	}, [close, on]);

	const validateDate = (newValue?: Date) => {
		return !(
			newValue &&
			(isNaN(newValue.getTime()) ||
				(!noIntervalValidate &&
					((min && newValue < new Date(min)) || (max && newValue > endOfTheDay(new Date(max))))))
		);
	};

	const [calendarValue, setCalendarValue] = useCallbackState(initialValue, (newValue, oldValue) => {
		if (!validateDate(newValue)) {
			return oldValue;
		}

		return newValue;
	});

	const maxDays = getMaxDay(calendarValue);
	const thisYear = new Date().getFullYear() - YEAR_OFFSET;

	const validateAndSetDate = (newDate: Date) => {
		if (validateDate(newDate)) {
			setCalendarValue(newDate);

			return true;
		} else {
			return false;
		}
	};

	var [year, setYear] = useDateState(
		calendarValue ? String(calendarValue.getFullYear() - YEAR_OFFSET) : "",
		0,
		thisYear,
		["", month, day],
		[1, 0, 0],
		validateAndSetDate
	);
	var [month, setMonth] = useDateState(
		calendarValue ? String(calendarValue.getMonth() - MONTH_OFFSET) : "",
		1,
		12,
		[year, "", day],
		[0, 1, 0],
		validateAndSetDate
	);
	var [day, setDay] = useDateState(
		calendarValue ? String(calendarValue.getDate()) : "",
		1,
		maxDays,
		[year, month, ""],
		[0, 1, 0],
		validateAndSetDate
	);

	useEffect(() => {
		if (calendarValue) {
			setDay(String(calendarValue.getDate()), true);
			setMonth(String(calendarValue.getMonth() - MONTH_OFFSET), true);
			setYear(String(calendarValue.getFullYear() - YEAR_OFFSET), true);
		}
	}, [+calendarValue!]);

	useEffect(() => {
		if (!calendarValue && year && month && day) {
			setCalendarValue(new Date(+year + YEAR_OFFSET, +month + MONTH_OFFSET, +day));
		}
	}, [+calendarValue!, year, month, day]);

	useEffect(() => {
		setCalendarValue(initialValue);
		// console.log("set", initialValue);
	}, [+initialValue!]);

	const topRef = useRef<HTMLDivElement>(null);
	useOnClickOutside([topRef], closeByClickAway, on);

	const [hours, onHoursChange] = useCallbackState(
		initialValue ? initialValue.getHours() : "",
		(event: ChangeEvent<HTMLInputElement>, prev) => {
			const realValue = event.target.value;

			if (realValue === "") {
				return "";
			}

			const value = +realValue;

			return value >= 0 && value <= 23 ? value : prev;
		}
	);

	const [minutes, onMinutesChange] = useCallbackState(
		initialValue ? initialValue.getMinutes() : "",
		(event: ChangeEvent<HTMLInputElement>, prev) => {
			const realValue = event.target.value;

			if (realValue === "") {
				return "";
			}

			const value = +realValue;

			return value >= 0 && value <= 60 ? value : prev;
		}
	);

	const onCalendarValueSet = useCallback(
		(date: Date) => {
			setCalendarValue(date);
		},
		[setCalendarValue]
	);

	useEffect(
		() => {
			if (calendarValue) {
				const year = calendarValue.getFullYear();
				const month = calendarValue.getMonth();
				const day = calendarValue.getDate();
				const newDate = new Date(year, month, day, +hours, +minutes);
				onChange(newDate);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hours, minutes, calendarValue]
	);

	return (
		<div className={classNames(className, styles.component)} ref={topRef}>
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
			<input
				name={name}
				type="hidden"
				value={calendarValue ? dateToISODate(calendarValue) : ""}
				readOnly={readOnly}
				required={required}
			/>
			<FieldFrame
				className={styles.toggle}
				focus={on}
				placeholder={!calendarValue}
				onClick={!readOnly ? toggle : () => null}
				error={error}
			>
				{calendarValue
					? `${to2DigitOrNothing(day)}.${to2DigitOrNothing(month)}.${to2DigitOrNothing(year)} ${
							hours !== "" ? asTwoDigitNumber(hours) : ""
					  }${hours !== "" || minutes !== "" ? ":" : ""}${
							minutes !== "" ? asTwoDigitNumber(minutes) : ""
					  }`
					: placeholder}
				<Icon />
			</FieldFrame>
			{/*put calendar first to allow forward-tabbing */}
			<div
				className={styles.wrapper}
				style={
					{
						"--dropdown-width": dropdownWidth,
						height: on ? `${calendarHeight}px` : 0,
					} as CSSProperties
				}
			>
				<div
					className={classNames(
						styles.dropdown,
						on && styles.visible,
						dropdownPosition && styles[dropdownPosition]
					)}
					// onFocus={onFocus}
					// onBlur={onBlur}
					ref={setCalendarRef}
					onBlur={onBlur}
				>
					{on && (
						<div className={styles.calendar}>
							<Calendar
								label={labels[0]}
								quickNav={quickNav}
								disableEmptyDays={false}
								value={calendarValue}
								minDate={min ? new Date(min) : undefined}
								maxDate={max ? new Date(max) : undefined}
								dayFill={dayFill}
								selection={selection}
								selected={calendarValue}
								onChange={onCalendarValueSet}
							/>

							<div className={styles.time}>
								<Body1 Component="span">{labels[0]}</Body1>
								<Input
									name="hours"
									type="number"
									inputProps={{
										min: "0",
										max: "23",
									}}
									placeholder="12"
									required
									value={hours}
									onChange={onHoursChange as any}
									after="Hour"
									size="small"
								/>
								:
								<Input
									name="minutes"
									type="number"
									inputProps={{
										min: "0",
										max: "60",
									}}
									placeholder="35"
									required
									value={minutes}
									onChange={onMinutesChange as any}
									after="Min"
									size="small"
								/>
								<Button
									className={styles.close}
									onClick={close}
									color="primary-black"
									variant="contained"
								>
									Close
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
