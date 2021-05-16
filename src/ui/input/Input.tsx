import React, { FC } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";
import { Field } from "react-final-form";
import { MaybeWithClassName } from "@app/helper/react/types";
import { TextColor } from "../text-color";
import { ReactNode } from "react";

type InputType = {
	name: string;
	label: string | ReactNode;
	type: "text" | "email";
	placeholder?: string;
	readOnly?: boolean;
	initialValue?: any;
	required?: boolean;
	validate?: (value: string) => any;
	before?: string | ReactNode;
	after?: string | ReactNode;
	value?: any;
};

export const Input: FC<InputType & MaybeWithClassName> = ({
	className,
	name,
	label,
	type,
	placeholder,
	readOnly,
	initialValue,
	required,
	validate,
	before,
	after,
	value,
}) => {
	return (
		<Field name={name} initialValue={initialValue} validate={validate} value={value}>
			{({ input, meta }) => (
				<div className={classNames(className, styles.component)}>
					<div className={styles.field}>
						<label htmlFor={name}>{label}</label>
						<div
							className={classNames(
								styles.input,
								before && styles.before,
								after && styles.after,
								before && after && styles.beforeAndAfter
							)}
						>
							{before}
							<input
								{...input}
								id={name}
								type={type}
								placeholder={placeholder}
								readOnly={readOnly}
								required={required}
							/>
							{after}
						</div>
					</div>
					<div className={styles.error}>
						{meta.error && meta.touched && <TextColor color="pink">{meta.error}</TextColor>}
						{meta.submitError && <TextColor color="pink">{meta.submitError}</TextColor>}
					</div>
				</div>
			)}
		</Field>
	);
};
