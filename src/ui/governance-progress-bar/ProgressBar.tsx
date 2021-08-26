import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { PROPOSAL_STATUS } from "@app/utils/governance";

import styles from "./ProgressBar.module.scss";

type ProgressBarType = {
	status: PROPOSAL_STATUS;
	fillInPercentage: number;
};

export const ProgressBar: FC<ProgressBarType & MaybeWithClassName> = ({
	className,
	status,
	fillInPercentage,
}) => {
	const COLORS: Record<PROPOSAL_STATUS, any> = {
		// [PROPOSAL_STATUS.COMING]: "var(--primary-black)",
		[PROPOSAL_STATUS.PASSED]: "var(--success)",
		[PROPOSAL_STATUS.LIVE]: "var(--process)",
		[PROPOSAL_STATUS.FAILED]: "var(--error)",
	};

	return (
		<span
			className={classNames(
				className,
				styles.component,
				status === PROPOSAL_STATUS.LIVE && styles.coming
			)}
			style={
				{ "--color": COLORS[status], "--progress-bar": `${fillInPercentage}%` } as CSSProperties
			}
		/>
	);
};
