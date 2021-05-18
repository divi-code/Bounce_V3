import classNames from "classnames";

import { FC, ChangeEventHandler } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./Checkbox.module.scss";

type CheckboxType = {
	name: string;
	value: string;
	checked?: boolean;
	required?: boolean;
	readOnly?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const Checkbox: FC<CheckboxType & MaybeWithClassName> = ({
	className,
	children,
	name,
	value,
	checked,
	readOnly,
	required,
	onChange,
}) => {
	return (
		<label className={classNames(className, styles.component, checked && styles.checked)}>
			{children}
			<input
				className={styles.input}
				type="checkbox"
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				readOnly={readOnly}
				required={required}
			/>
		</label>
	);
};
