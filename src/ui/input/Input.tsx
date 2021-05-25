import classNames from "classnames";
import React, { FC, ReactNode, useCallback, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Caption } from "@app/ui/typography";

import styles from "./Input.module.scss";

type InputType = {
	name: string;
	type: string;
	value?: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	before?: string | ReactNode;
	after?: string | ReactNode;
	error?: string;
	onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
	onBlur?(e: React.FocusEvent): void;
	onFocus?(e: React.FocusEvent): void;
};

export const Input: FC<InputType & MaybeWithClassName> = ({
	className,
	name,
	type,
	placeholder,
	readOnly,
	required,
	before,
	after,
	error,
	value,
	onChange,
	onBlur,
	onFocus,
}) => {
	const [inputFocused, setInputFocused] = useState(false);

	const onInputFocused = useCallback(
		(e) => {
			setInputFocused(true);
			onFocus && onFocus(e.target.value);
		},
		[onFocus]
	);

	const onInputBlur = useCallback(
		(e) => {
			setInputFocused(false);
			onBlur && onBlur(e.target.value);
		},
		[onBlur]
	);

	return (
		<div className={className}>
			<div
				className={classNames(
					styles.component,
					inputFocused && styles.focus,
					error && styles.errorState,
					before && styles.before,
					after && styles.after,
					before && after && styles.beforeAndAfter
				)}
			>
				{before}
				<input
					className={styles.input}
					name={name}
					type={type}
					value={value}
					placeholder={!inputFocused && placeholder}
					readOnly={readOnly}
					required={required}
					onChange={onChange}
					onFocus={onInputFocused}
					onBlur={onInputBlur}
				/>
				{after}
			</div>
			<div className={styles.error}>{error && <Caption Component="span">{error}</Caption>}</div>
		</div>
	);
};
