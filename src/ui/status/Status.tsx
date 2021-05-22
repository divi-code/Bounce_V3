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
		live: "var(--success)",
		filled: "var(--process)",
		closed: "var(--error)",
		error: "var(--error)",
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
