import classNames from "classnames";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";

import { FC } from "react";

import { OnOff } from "@app/ui/on-off";
import { Body1, Caption } from "@app/ui/typography";

import styles from "./Toggle.module.scss";

interface ToggleProps<T> {
	className?: string;
	count: number;
	img: string;
	name: string;
	checked: boolean;
	disabled?: boolean;
	reference: T;
	onChange: (e: T, checked: boolean) => void;
}

export const Toggle: FC<ToggleProps<any>> = ({
	className,
	count,
	img,
	name,
	checked,
	reference,
	onChange,
}) => {
	const handleOnChange = useCallback(() => onChange(reference, !checked), [onChange, reference]);
	const [imageIsOk, setImageIsOk] = useState(true);

	useEffect(() => {
		const testImage = new Image();
		testImage.onerror = () => setImageIsOk(false);
		testImage.src = img;
	}, [img]);

	return (
		<li
			className={classNames(className, styles.component)}
			style={imageIsOk ? ({ "--icon": `url(${img})` } as CSSProperties) : {}}
		>
			<Body1 Component="span" className={styles.name}>
				{name}
			</Body1>
			<Caption className={styles.count} Component="span" lighten={60}>
				{count} tokens
			</Caption>
			<OnOff
				className={styles.toggle}
				name={name}
				value={name}
				checked={checked}
				onChange={handleOnChange}
			/>
		</li>
	);
};
