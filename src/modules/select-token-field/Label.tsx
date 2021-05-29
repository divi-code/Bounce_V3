import classNames from "classnames";
import React, { CSSProperties, forwardRef, useCallback, useEffect, useState } from "react";

import { Body1, Caption } from "@app/ui/typography";

import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import styles from "./Label.module.scss";

interface LabelProps<T> {
	className?: string;
	id: string;
	currency: string;
	title: string;
	img: string | undefined;
	name: string;
	checked: boolean;
	disabled?: boolean;
	reference: T;
	onChange: (e: T) => void;
}

export const Label = forwardRef<HTMLInputElement, LabelProps<any>>(
	({ className, id, currency, title, img, name, checked, disabled, reference, onChange }, ref) => {
		const realImage = img ? uriToHttp(img)[0] : undefined;
		const handleOnChange = useCallback(() => onChange(reference), [onChange, reference]);
		const [imageIsOk, setImageIsOk] = useState(Boolean(realImage));

		useEffect(() => {
			if (realImage) {
				const testImage = new Image();
				testImage.onerror = () => setImageIsOk(false);
				testImage.src = realImage;
			}
		}, [realImage]);

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
					style={imageIsOk ? ({ "--icon": `url(${realImage})` } as CSSProperties) : {}}
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
