import classNames from "classnames";

import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ComponentElement } from "react";
import ClickAwayListener from "react-click-away-listener";

import { MaybeWithClassName } from "@app/helper/react/types";

import {
	dateToISODate,
	endOfTheDay,
	getDateOrder,
	to2DigitOrNothing,
} from "@app/ui/utils/dateFormatter";

import { Calendar } from "../calendar";

import styles from "./DatePicker.module.scss";

type Dispatch<A> = (value: A, force?: boolean) => void;

export function useCallbackState<S>(
	initialState: S | (() => S),
	changeCallback: (s: S, old: S) => S | undefined | void
): [S, Dispatch<S>] {
	const [state, setState] = useState(initialState);
	const callbackRef = useRef(changeCallback);
	callbackRef.current = changeCallback;

	const updateState = useCallback((newState, forceUpdate?: boolean) => {
		if (forceUpdate) {
			setState(newState);
		} else {
			setState((oldState) => callbackRef.current(newState, oldState) || newState);
		}
	}, []);

	return [state, updateState];
}

const isFinite = (a: string) => !isNaN(+a);

const getMaxDay = (date?: Date) =>
	date ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() : 31;

const Icon = (props) => (
	<svg viewBox="0 0 20 20" fill="none" {...props}>
		<path d="M18.862 3.281a1.372 1.372 0 00-1.005-.424H16.43V1.786a1.72 1.72 0 00-.525-1.261A1.72 1.72 0 0014.643 0h-.714a1.72 1.72 0 00-1.261.525c-.35.35-.525.77-.525 1.26v1.072H7.857V1.786A1.72 1.72 0 007.333.525 1.72 1.72 0 006.072 0h-.715a1.72 1.72 0 00-1.26.525c-.35.35-.526.77-.526 1.26v1.072H2.143c-.387 0-.722.142-1.005.424a1.373 1.373 0 00-.424 1.005v14.286c0 .386.142.721.424 1.004.283.283.618.424 1.005.424h15.714c.387 0 .722-.141 1.004-.424.283-.283.424-.618.424-1.004V4.286c0-.387-.14-.722-.423-1.005zm-5.29-1.495c0-.104.033-.19.1-.257a.348.348 0 01.256-.1h.715c.104 0 .19.033.256.1.067.067.1.153.1.257V5c0 .104-.033.19-.1.257a.349.349 0 01-.256.1h-.715a.348.348 0 01-.256-.1.348.348 0 01-.1-.257V1.786zM5 1.786c0-.104.034-.19.1-.257a.348.348 0 01.257-.1h.715c.104 0 .19.033.256.1.067.067.1.153.1.257V5c0 .104-.033.19-.1.257a.348.348 0 01-.256.1h-.715a.347.347 0 01-.256-.1A.348.348 0 015 5V1.786zM17.857 18.57H2.143V7.143h15.714V18.57z" />
	</svg>
);

interface Props {
	initialValue?: Date;
	min?: string;
	max?: string;
	name: string;
	calenderLabel: string;
	label: ReactNode;
	dayFill?: Record<number, number | boolean>;
	scattered?: boolean;
	noIntervalValidate?: boolean;

	onValueChange(date: Date): void;
}

const testMinMax = (value: string, min?: number, max?: number) =>
	!value || !+value || ((!min || +value >= min) && (!max || +value <= max));

export const DatePicker: FC<Props & MaybeWithClassName> = ({
	initialValue,
	min,
	max,
	dayFill,
	onValueChange,
	label,
	noIntervalValidate,
	className,
	calenderLabel,
}) => {
	const validateDate = (newValue?: Date) => {
		return !(
			newValue &&
			(isNaN(newValue.getTime()) ||
				(!noIntervalValidate &&
					((min && newValue < new Date(min)) || (max && newValue > endOfTheDay(new Date(max))))))
		);
	};

	const [value, setValue] = useCallbackState(initialValue, (newValue, oldValue) => {
		if (!validateDate(newValue)) {
			return oldValue;
		}

		return newValue;
	});

	const [focused, setFocused] = useState(0);
	const [displayCalendar, setCalendarDisplay] = useState(true);

	const close = () => setCalendarDisplay(false);

	const onFocus = () => setFocused((f) => f + 1);
	const onBlur = () => setTimeout(() => setFocused((f) => f - 1), 16);

	const YEAR_OFFSET = 2000;
	const MONTH_OFFSET = -1;
	const minYear = min ? new Date(min).getFullYear() - YEAR_OFFSET : undefined;
	const maxYear = max ? new Date(max).getFullYear() - YEAR_OFFSET : undefined;
	const maxDays = getMaxDay(value);
	const thisYear = new Date().getFullYear() - YEAR_OFFSET;

	const [year, setYear] = useCallbackState(
		value ? String(value.getFullYear() - YEAR_OFFSET) : "",
		(newValue, oldValue) => {
			if (testMinMax(newValue, 0, thisYear)) {
				if (newValue && isFinite(newValue) && month && day) {
					const newDate = new Date(+newValue + YEAR_OFFSET, +month + MONTH_OFFSET, +day);

					if (validateDate(newDate)) {
						setValue(newDate);
					} else {
						return oldValue;
					}
				}

				return newValue ? String(+newValue) : newValue;
			}

			return oldValue;
		}
	);
	const [month, setMonth] = useCallbackState(
		value ? String(value.getMonth() - MONTH_OFFSET) : "",
		(newValue, oldValue) => {
			if (testMinMax(newValue, 1, 12)) {
				if (newValue && isFinite(newValue) && year && day) {
					const newDate = new Date(+year + YEAR_OFFSET, +newValue + MONTH_OFFSET, +day);

					if (validateDate(newDate)) {
						setValue(newDate);
					} else {
						return oldValue;
					}
				}

				return newValue ? String(+newValue) : newValue;
			}

			return oldValue;
		}
	);
	const [day, setDay] = useCallbackState(
		value ? String(value.getDate()) : "",
		(newValue, oldValue) => {
			if (testMinMax(newValue, 1, maxDays)) {
				if (newValue && isFinite(newValue) && year && month) {
					const newDate = new Date(+year + YEAR_OFFSET, +month + MONTH_OFFSET, +newValue);

					if (validateDate(newDate)) {
						setValue(newDate);
					} else {
						return oldValue;
					}
				}

				return newValue ? String(+newValue) : newValue;
			}

			return oldValue;
		}
	);

	useEffect(() => {
		if (value) {
			onValueChange(value);
			setDay(String(value.getDate()), true);
			setMonth(String(value.getMonth() - MONTH_OFFSET), true);
			setYear(String(value.getFullYear() - YEAR_OFFSET), true);
		}
	}, [+value!]);

	useEffect(() => {
		if (!value && year && month && day) {
			setValue(new Date(+year + YEAR_OFFSET, +month + MONTH_OFFSET, +day));
		}
	}, [+value!, year, month, day]);

	useEffect(() => {
		setValue(initialValue);
	}, [+initialValue!]);

	const dateOrder = getDateOrder();

	const inputRefs = useRef<HTMLSpanElement>(null);
	const firstInputRef = useRef<HTMLInputElement>(null);
	const calendarRef = useRef<HTMLDivElement>(null);

	const targetRef = firstInputRef;

	const shouldDisplayCalendar = !!focused && displayCalendar;

	const processInputs = (inputs: Array<ComponentElement<any, any>>) => {
		const sorted = inputs.sort((a, b) => dateOrder[a.key as any] - dateOrder[b.key as any]);

		sorted[0] = {
			...sorted[0],
			ref: firstInputRef,
		};

		return [
			sorted[0],
			<span className={styles.field__dot} key="dot1">
				{to2DigitOrNothing(day) && "."}
			</span>,
			sorted[1],
			<span className={styles.field__dot} key="dot2">
				{to2DigitOrNothing(month) && "."}
			</span>,
			sorted[2],
		];
	};

	return (
		<div className={classNames(className, styles.field)} onFocus={onFocus} onBlur={onBlur}>
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
			<div
				className={classNames(
					styles.field__field,
					shouldDisplayCalendar && styles["field__field--focused"]
				)}
				onClick={() => {
					setCalendarDisplay(true);

					if (!focused) {
						setTimeout(() => targetRef.current && targetRef.current.focus(), 4);
					}
				}}
			>
				<label
					className={classNames(
						styles.field__label,
						(focused || value) && styles["field__label--focused"]
					)}
				>
					{label}
				</label>
				<span
					className={classNames(
						styles["field__input-wrapper"],
						(focused || value) && styles["field__input-wrapper--focused"]
					)}
					ref={inputRefs}
				>
					{processInputs([
						<input
							className={styles.field__input}
							key="day"
							min={1}
							max={maxDays}
							type="number"
							value={to2DigitOrNothing(day)}
							onChange={(e) => setDay(e.target.value)}
						/>,
						<input
							className={styles.field__input}
							key="month"
							min={1}
							max={12}
							type="number"
							value={to2DigitOrNothing(month)}
							onChange={(e) => setMonth(e.target.value)}
						/>,
						<input
							className={styles.field__input}
							key="year"
							min={minYear}
							max={maxYear}
							type="number"
							value={to2DigitOrNothing(year)}
							onChange={(e) => setYear(e.target.value)}
						/>,
					])}
					<input name={name} type="hidden" value={value ? dateToISODate(value) : ""} />
				</span>
				<Icon className={styles.field__icon} />
			</div>
			{/*put calendar first to allow forward-tabbing */}
			<ClickAwayListener onClickAway={close}>
				<div className={styles["field__dropdown-wrapper"]}>
					<div
						className={classNames(
							styles.field__dropdown,
							shouldDisplayCalendar && styles["field__dropdown--visible"]
						)}
						tabIndex={-1}
						ref={calendarRef}
					>
						<Calendar
							label={calenderLabel}
							disableEmptyDays={false}
							className={styles.field__calendar}
							value={value}
							minDate={min ? new Date(min) : undefined}
							maxDate={max ? new Date(max) : undefined}
							dayFill={dayFill}
							onChange={(date) => {
								setValue(date);
								close();

								if (targetRef === firstInputRef) {
									firstInputRef.current && firstInputRef.current.focus();
								}
							}}
						/>
					</div>
				</div>
			</ClickAwayListener>
		</div>
	);
};
