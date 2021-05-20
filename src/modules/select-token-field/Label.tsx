import classNames from "classnames";
import React, { CSSProperties, forwardRef, useCallback } from "react";

import { Body1, Caption } from "@app/ui/typography";

import styles from "./Label.module.scss";

interface LabelProps<T> {
	className?: string;
	id: string;
	currency: string;
	title: string;
	img: string;
	name: string;
	checked: boolean;
	disabled?: boolean;
	reference: T;
	onChange: (e: T) => void;
}

export const Label = forwardRef<HTMLInputElement, LabelProps<any>>(
	({ className, id, currency, title, img, name, checked, disabled, reference, onChange }, ref) => {
		const handleOnChange = useCallback(() => onChange(reference), [onChange, reference]);

		return (
			<div className={classNames(className, styles.component)} role="presentation">
				<input
					className={styles.input}
					ref={ref}
					id={id}
					type="radio"
					name={name}
					onChange={handleOnChange}
					checked={checked}
					disabled={disabled}
				/>
				<label
					htmlFor={id}
					className={styles.label}
					style={{ "--icon": `url("${img}")` } as CSSProperties}
				>
					<Body1 Component="span">{currency}</Body1>
					<Caption Component="span" lighten={80}>
						{title}
					</Caption>
				</label>
			</div>
		);
	}
);
