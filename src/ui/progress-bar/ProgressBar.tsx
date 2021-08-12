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
	fillInPercentage = 0,
}) => {
	const COLORS: Record<POOL_STATUS, any> = {
		[POOL_STATUS.COMING]: "var(--primary-black)",
		[POOL_STATUS.LIVE]: "var(--success)",
		[POOL_STATUS.FILLED]: "var(--process)",
		[POOL_STATUS.CLOSED]: "var(--error)",
		[POOL_STATUS.ERROR]: "var(--error)",
	};

	return (
		<div
			className={classNames(
				className,
				styles.component,
				status === POOL_STATUS.COMING && styles.coming
			)}
			style={{ "--color": COLORS[status] } as CSSProperties}
		>
			<div style={{ width: `${fillInPercentage}%` }} />
		</div>
	);
};
