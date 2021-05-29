import classNames from "classnames";

import { FC, ChangeEventHandler } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./OnOff.module.scss";

type OnOffType = {
	name: string;
	value: string;
	checked?: boolean;
	required?: boolean;
	readOnly?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const OnOff: FC<OnOffType & MaybeWithClassName> = ({
	className,
	name,
	value,
	checked,
	readOnly,
	required,
	onChange,
}) => {
	return (
		<label className={classNames(className, styles.component, checked && styles.checked)}>
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
