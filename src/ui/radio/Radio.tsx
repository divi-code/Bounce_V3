import classNames from "classnames";

import { FC, ChangeEventHandler } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Tooltip } from "@app/ui/tooltip";

import styles from "./Radio.module.scss";

type RadioType = {
	name: string;
	value: string;
	tooltip?: string;
	checked?: boolean;
	required?: boolean;
	readOnly?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const Radio: FC<RadioType & MaybeWithClassName> = ({
	className,
	children,
	name,
	value,
	checked,
	readOnly,
	required,
	onChange,
	tooltip,
}) => {
	return (
		<div className={classNames(className, styles.component)}>
			<label className={classNames(styles.label, checked && styles.checked)}>
				{children}
				<input
					className={styles.input}
					type="radio"
					name={name}
					value={value}
					checked={checked}
					onChange={onChange}
					readOnly={readOnly}
					required={required}
				/>
			</label>
			{tooltip && <Tooltip size="small">{tooltip}</Tooltip>}
		</div>
	);
};
