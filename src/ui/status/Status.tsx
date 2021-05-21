import classNames from "classnames";
import { CSSProperties, FC, ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Caption } from "@app/ui/typography";

import styles from "./Status.module.scss";

export type StatusType = "live" | "filled" | "closed";

type StatusProps = {
	status: StatusType;
	captions: Record<StatusType, ReactNode>;
};

export const Status: FC<StatusProps & MaybeWithClassName> = ({ className, status, captions }) => {
	const COLORS = {
		live: "var(--success)",
		filled: "var(--process)",
		closed: "var(--error)",
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
