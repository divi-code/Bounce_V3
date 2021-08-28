import classNames from "classnames";
import { CSSProperties, FC, ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Caption } from "@app/ui/typography";

import { PROPOSAL_STATUS } from "@app/utils/governance";

import styles from "./Status.module.scss";

type StatusProps = {
	status: PROPOSAL_STATUS;
	captions: Record<PROPOSAL_STATUS, ReactNode>;
};

export const Status: FC<StatusProps & MaybeWithClassName> = ({ className, status, captions }) => {
	const COLORS: Record<PROPOSAL_STATUS, string> = {
		// [PROPOSAL_STATUS.COMING]: "var(--primary-black)",
		[PROPOSAL_STATUS.LIVE]: "var(--success)",
		[PROPOSAL_STATUS.PASSED]: "var(--success)",
		[PROPOSAL_STATUS.FAILED]: "var(--error)",
	};

	return (
		<Caption
			className={classNames(
				className,
				styles.component,
				status === PROPOSAL_STATUS.LIVE && styles.coming
			)}
			Component="span"
			style={{ "--color": COLORS[status] } as CSSProperties}
			color="custom"
		>
			{captions[status]}
		</Caption>
	);
};
