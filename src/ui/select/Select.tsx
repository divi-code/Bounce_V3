import classNames from "classnames";
import { ReactNode } from "react";
import {
	useCallback,
	useState,
	KeyboardEvent,
	useRef,
	useEffect,
	ChangeEvent,
	forwardRef,
} from "react";
import { uid, useUID } from "react-uid";

import { useOnClickOutside } from "@app/hooks/use-click-outside";
import { useFocusTracker, useOpenControl } from "@app/hooks/use-field-control";

import { FieldFrame } from "@app/ui/field-frame";

import { Arrow } from "@app/ui/icons/arrow-down";

import styles from "./Select.module.scss";

interface ItemProps<T> {
	className?: string;
	id: string;
	label: ReactNode;
	name: string;
	checked: boolean;
	disabled?: boolean;
	reference: T;
	onChange: (e: T) => void;
}

const Item = forwardRef<HTMLInputElement, ItemProps<any>>(
	({ className, id, label, name, checked, disabled, reference, onChange }, ref) => {
		const handleOnChange = useCallback(() => onChange(reference), [onChange, reference]);

		return (
			<div className={className} role="presentation">
				<input
					ref={ref}
					id={id}
					type="radio"
					name={name}
					onChange={handleOnChange}
					checked={checked}
					disabled={disabled}
				/>
				<label htmlFor={id}>{label}</label>
			</div>
		);
	}
);

export interface ListItemProps<P> {
	key: P;
	label: ReactNode;
}

interface SelectProps<P extends string> {
	className?: string;
	options: ListItemProps<P>[];
	value?: P;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Select = <P extends string>({
	className,
	options,
	value,
	name,
	placeholder,
	readOnly,
	required,
	onChange,
}: SelectProps<P>) => {
	const [on, open, close, toggle] = useOpenControl();
	const [focused, onFocus, onBlur] = useFocusTracker();

	const activeRef = useRef<HTMLInputElement>(null);
	const controlButtonRef = useRef<HTMLButtonElement>(null);
	const valueContainerRef = useRef<HTMLInputElement>(null);

	const [pendingOperation, setPendingOperation] = useState(0);

	const [changed, setChanged] = useState(false);
	const initialActive = options.find((item) => item.key === value);
	const defaultActive = initialActive
		? initialActive
		: placeholder
		? { key: undefined, label: placeholder }
		: options[0];
	const [active, setActive] = useState(defaultActive);

	useEffect(() => {
		if (value) {
			setActive(options.find((item) => item.key === value));
		}
	}, [options, value]);

	const handleChange = useCallback((item) => {
		setActive(item);
		setChanged(true);
	}, []);

	const cancelChange = useCallback(() => {
		setChanged(false);
		setActive(defaultActive);
	}, [defaultActive]);

	const handleControlKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Escape") {
				//ESC on button: cancel change, close
				cancelChange();
				close();
			}

			// open on box keydown
			// on other keys it would be opened automatically
			if (e.key === "ArrowDown") {
				//ArrowDown on control -> open
				open();
			}

			if (e.key === "ArrowDown" || e.key === "Enter" || e.key === "Space") {
				//Action on control -> move focus
				setImmediate(() => activeRef.current?.focus());
			}
		},
		[cancelChange, close, open]
	);

	const handleDropKeyPress = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Escape") {
				//ESC on dropdown: cancel change, close
				cancelChange();
				controlButtonRef.current?.focus();
			}

			if (e.key === "Enter" || e.key === "Space") {
				//Action on dropdown: accept, close
				setChanged(true);
				controlButtonRef.current?.focus();
			}
		},
		[cancelChange]
	);

	const handleDropHold = useCallback(() => {
		setPendingOperation((counter) => counter + 1);
	}, []);

	//click on drop: accept, close, refocus
	const handleDropClick = useCallback((e: any) => {
		setTimeout(() => {
			setPendingOperation((counter) => counter - 1);
			setChanged(true);
			controlButtonRef.current?.focus();
		}, 0);
	}, []);

	//click outside: close
	const closeByClickAway = useCallback(() => {
		if (on) {
			close();
		}
	}, [close, on]);

	//focus out of drop: close
	useEffect(() => {
		if (!focused && !pendingOperation) {
			close();
		}
	}, [close, focused, pendingOperation]);

	//result changed: trigger changes
	useEffect(() => {
		if (changed && !on && onChange) {
			// target is the only thing react-final-form needs
			onChange({ target: valueContainerRef.current } as any);
		}
	}, [active, changed, onChange, on]);

	// reset pending counter
	useEffect(() => {
		if (!on) {
			setPendingOperation(0);
		}
	}, [on]);

	const groupName = useUID();
	const listBoxID = useUID();

	const topRef = useRef<HTMLDivElement>(null);
	useOnClickOutside([topRef], closeByClickAway, on);

	return (
		<div className={classNames(styles.component, className)} ref={topRef}>
			<input
				type="hidden"
				name={name}
				value={active.key}
				ref={valueContainerRef}
				readOnly={readOnly}
				required={required}
			/>
			<FieldFrame
				focus={on}
				placeholder={active.key === undefined}
				onClick={!readOnly ? toggle : () => null}
				onKeyDown={!readOnly ? handleControlKeyDown : () => null}
				ref={controlButtonRef}
				ariaOwns={listBoxID}
				ariaHaspopup="listbox"
				ariaExpanded={on}
			>
				{active && active.label}
				<Arrow style={{ transform: !on ? "rotate(180deg)" : "rotate(0)" }} />
			</FieldFrame>

			<div className={styles.wrapper}>
				{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
				<div
					className={classNames(styles.dropdown, on && styles.visible)}
					onFocus={onFocus}
					onBlur={onBlur}
					onKeyUp={handleDropKeyPress}
					// not using onClick handler - it interferes with keyboard
					onMouseDown={handleDropHold}
					onTouchStart={handleDropHold}
					onMouseUp={handleDropClick}
					onTouchEnd={handleDropClick}
				>
					{on && (
						<ul className={styles.list} id={listBoxID} role="listbox">
							{options.map((item, index) => {
								const checked = item === active;

								return (
									<li className={styles.item} key={uid(item)} role="option" aria-selected={checked}>
										<Item
											ref={checked || (!active && index === 0) ? activeRef : undefined}
											className={classNames(styles.input, checked && styles.active)}
											onChange={handleChange}
											reference={item}
											label={item.label}
											id={uid(item)}
											name={groupName}
											checked={checked}
										/>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};
