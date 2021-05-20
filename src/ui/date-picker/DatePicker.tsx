/* eslint-disable */
import classNames from "classnames";

import React, {FC, useEffect, useRef, useState} from "react";
import {useCallbackState} from "use-callback-state";

import {MaybeWithClassName} from "@app/helper/react/types";

import {
  dateToISODate,
  endOfTheDay,
  to2DigitOrNothing,
} from "@app/ui/utils/dateFormatter";

import {Calendar, QuickNavType} from "../calendar";

import styles from "./DatePicker.module.scss";
import {useOnClickOutside} from "@app/hooks/use-click-outside";
import {CSSProperties} from "react";
import {useResizeObserver} from "@app/hooks/use-resize-observer";

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
  noIntervalValidate?: boolean;
  label: string;
  dropdownWidth?: string;
  quickNav?: Array<QuickNavType>;
  dropdownPosition?: DropdownPositionType;
  onChange(date: Date): void;
  readOnly?: boolean;
  required?: boolean;
}

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

export const DatePicker: FC<DatePickerType & MaybeWithClassName> = ({
                                                                      name,
                                                                      initialValue,
                                                                      min,
                                                                      max,
                                                                      dayFill,
                                                                      onChange,
                                                                      placeholder,
                                                                      noIntervalValidate,
                                                                      className,
                                                                      label,
                                                                      dropdownWidth = "100%",
                                                                      dropdownPosition = "left",
                                                                      quickNav,
                                                                      readOnly,
                                                                      required
                                                                    }) => {
  const [calendarRef, setCalendarRef] = useState<HTMLElement | null>(null);

  const [calendarHeight, setCalendarHeight] = useState(0);
  useResizeObserver(calendarRef, (ref) => setCalendarHeight(ref.clientHeight));

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

  const maxDays = getMaxDay(value);
  const thisYear = new Date().getFullYear() - YEAR_OFFSET;

  const validateAndSetDate = (newDate: Date) => {
    if (validateDate(newDate)) {
      setValue(newDate);

      return true;
    } else {
      return false;
    }
  };

  const [year, setYear] = useDateState(
    value ? String(value.getFullYear() - YEAR_OFFSET) : "",
    0,
    thisYear,
    ["", month, day],
    [1, 0, 0],
    validateAndSetDate
  );
  var [month, setMonth] = useDateState(
    value ? String(value.getMonth() - MONTH_OFFSET) : "",
    1,
    12,
    [year, "", day],
    [0, 1, 0],
    validateAndSetDate
  );
  var [day, setDay] = useDateState(
    value ? String(value.getDate()) : "",
    1,
    maxDays,
    [year, month, ""],
    [0, 1, 0],
    validateAndSetDate
  );

  useEffect(() => {
    if (value) {
      onChange(value);
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

  const inputRefs = useRef<HTMLDivElement>(null);

  const targetRef = inputRefs;

  const shouldDisplayCalendar = !!focused && displayCalendar;

  const innerDropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([innerDropdownRef], close, shouldDisplayCalendar);

  return (
    <div className={classNames(className, styles.component)} onFocus={onFocus} onBlur={onBlur} tabIndex={0}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={classNames(
          styles.field,
          focused && styles.focus,
          value && styles.value
        )}
        onClick={() => {
          setCalendarDisplay(true);

          if (!focused) {
            setTimeout(() => targetRef.current && targetRef.current.focus(), 1);
          }
        }}
      >
				<span>
					{(focused || value) ? value ? `${to2DigitOrNothing(day)}.${to2DigitOrNothing(month)}.${to2DigitOrNothing(year)}` : "" : placeholder}
				</span>
        <input name={name} type="hidden" value={value ? dateToISODate(value) : ""} readOnly={readOnly}
               required={required}/>
        <Icon className={styles.icon}/>
      </div>
      {/*put calendar first to allow forward-tabbing */}
      <div
        className={styles.wrapper}
        ref={innerDropdownRef}
        style={{
          "--dropdown-width": dropdownWidth,
          height: shouldDisplayCalendar ? `${calendarHeight}px` : 0
        } as CSSProperties}
      >
        <div
          className={classNames(
            styles.dropdown,
            shouldDisplayCalendar && styles.visible,
            dropdownPosition && styles[dropdownPosition]
          )}
          tabIndex={-1}
          ref={setCalendarRef}
        >
          <Calendar
            className={styles.calendar}
            label={label}
            quickNav={quickNav}
            disableEmptyDays={false}
            value={value}
            minDate={min ? new Date() : undefined}
            maxDate={max ? new Date(max) : undefined}
            dayFill={dayFill}
            onChange={(date) => {
              setValue(date);
              close();
            }}
          />
        </div>
      </div>
    </div>
  );
};
