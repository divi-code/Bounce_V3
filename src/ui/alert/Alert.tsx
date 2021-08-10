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
		[ALERT_TYPE.warning]: "var(--warning)",
	};

	return (
		<div
			className={classNames(className, styles.alert, styles[type], styles[`${type}Alert`])}
			style={{ ...style, "--color": COLORS[type] } as CSSProperties}
		>
			<div className={styles.wrapper}>
				{title && (
					<>
						<span className={styles.title}>{title}</span>{" "}
					</>
				)}
				{text && <span className={styles.text}>{text}</span>}
			</div>
		</div>
	);
};
