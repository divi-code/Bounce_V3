import classNames from "classnames";
import React, { FC, useCallback } from "react";

import { Body1, Caption } from "@app/ui/typography";

import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import { Icon } from "../icon";

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

export const Label: FC<LabelProps<any>> = ({
	className,
	currency,
	title,
	img,
	reference,
	onChange,
}) => {
	const realImage = img ? uriToHttp(img)[0] : undefined;
	const handleOnChange = useCallback(() => onChange(reference), [onChange, reference]);

	return (
		<div
			className={classNames(className, styles.component)}
			onClick={handleOnChange}
			role="presentation"
		>
			<Icon src={realImage} />
			<div className={styles.label}>
				<Body1 Component="span">{currency}</Body1>
				<Caption Component="span" lighten={80}>
					{title}
				</Caption>
			</div>
		</div>
	);
};
