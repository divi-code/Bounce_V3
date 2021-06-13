import classNames from "classnames";

import { CSSProperties, FC, ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./Alert.module.scss";

export enum ALERT_TYPE {
	default = "default",
	warning = "warning",
	success = "success",
	error = "error",
}

type AlertType = {
	title?: ReactNode;
	type: ALERT_TYPE;
	text?: ReactNode;
	style?: CSSProperties;
};

export const Alert: FC<AlertType & MaybeWithClassName> = ({
	className,
	title,
	text,
	type,
	style,
}) => {
	const COLORS = {
		[ALERT_TYPE.default]: "var(--primary-black)",
		[ALERT_TYPE.success]: "var(--success)",
		[ALERT_TYPE.error]: "var(--error)",
	};

	return (
		<div
			className={classNames(className, styles.component, styles[type])}
			style={{ ...style, "--color": COLORS[type] } as CSSProperties}
		>
			{title && (
				<>
					<span className={classNames(styles.title, styles[`${type}Title`])}>{title}</span>{" "}
				</>
			)}
			{text && <span className={styles.text}>{text}</span>}
		</div>
	);
};
