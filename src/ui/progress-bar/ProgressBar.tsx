import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./ProgressBar.module.scss";

type ProgressBarType = {
	status: POOL_STATUS;
	fillInPercentage: number;
};

export const ProgressBar: FC<ProgressBarType & MaybeWithClassName> = ({
	className,
	status,
	fillInPercentage,
}) => {
	const COLORS = {
		[POOL_STATUS.LIVE]: "var(--success)",
		[POOL_STATUS.FILLED]: "var(--process)",
		[POOL_STATUS.CLOSED]: "var(--error)",
	};

	return (
		<span
			className={classNames(className, styles.component)}
			style={
				{ "--color": COLORS[status], "--progress-bar": `${fillInPercentage}%` } as CSSProperties
			}
		/>
	);
};
