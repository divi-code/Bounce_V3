import classNames from "classnames";
import { CSSProperties, FC, ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Caption } from "@app/ui/typography";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./Status.module.scss";

type StatusProps = {
	status: POOL_STATUS;
	captions: Record<POOL_STATUS, ReactNode>;
};

export const Status: FC<StatusProps & MaybeWithClassName> = ({ className, status, captions }) => {
	const COLORS = {
		[POOL_STATUS.LIVE]: "var(--success)",
		[POOL_STATUS.FILLED]: "var(--process)",
		[POOL_STATUS.CLOSED]: "var(--error)",
		[POOL_STATUS.ERROR]: "var(--error)",
	};

	return (
		<Caption
			className={classNames(className, styles.component)}
			Component="span"
			style={{ "--color": COLORS[status] } as CSSProperties}
			color="custom"
		>
			{captions[status]}
		</Caption>
	);
};
