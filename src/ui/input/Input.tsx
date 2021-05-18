import classNames from "classnames";
import React, { FC, ReactNode, useCallback, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./Input.module.scss";

type InputType = {
	name: string;
	type: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	before?: string | ReactNode;
	after?: string | ReactNode;
	error?: string;
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
		<>
			<div
				className={classNames(
					className,
					styles.component,
					inputFocused && styles.focus,
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
					placeholder={!inputFocused && placeholder}
					readOnly={readOnly}
					required={required}
					onFocus={onInputFocused}
					onBlur={onInputBlur}
				/>
				{after}
			</div>
			<div className={styles.error}>{error && <span>{error}</span>}</div>
		</>
	);
};
