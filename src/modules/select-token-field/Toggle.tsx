import classNames from "classnames";
import React, { CSSProperties, forwardRef, useCallback, useEffect, useState } from "react";

import { Body1, Caption } from "@app/ui/typography";

import styles from "./Toggle.module.scss";

interface ToggleProps<T> {
	className?: string;
	id: string;
	count: number;
	img: string;
	name: string;
	checked: boolean;
	disabled?: boolean;
	reference: T;
	onChange: (e: T, checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps<any>>(
	({ className, id, count, img, name, checked, disabled, reference, onChange }, ref) => {
		const handleOnChange = useCallback(() => onChange(reference, !checked), [onChange, reference]);
		const [imageIsOk, setImageIsOk] = useState(true);

		useEffect(() => {
			const testImage = new Image();
			testImage.onerror = () => setImageIsOk(false);
			testImage.src = img;
		}, [img]);

		return (
			<div className={classNames(className, styles.component)} role="presentation">
				<input
					className={styles.input}
					ref={ref}
					id={id}
					type="checkbox"
					name={name}
					onChange={handleOnChange}
					checked={checked}
					disabled={disabled}
				/>
				<label
					htmlFor={id}
					className={styles.label}
					style={imageIsOk ? ({ "--icon": `url(${img})` } as CSSProperties) : {}}
				>
					<Body1 Component="span" className={styles.name}>
						{name}
					</Body1>
					<Caption className={styles.count} Component="span" lighten={60}>
						{count} tokens
					</Caption>
					<span className={styles.toggle}>{checked ? "on" : "off"}</span>
				</label>
			</div>
		);
	}
);
