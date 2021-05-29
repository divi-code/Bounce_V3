import classNames from "classnames";

import { ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Tooltip } from "@app/ui/tooltip";
import { Body1 } from "@app/ui/typography";

import styles from "./Label.module.scss";

import type { CSSProperties, FC } from "react";

export type LabelType = {
	Component: "label" | "div";
	label: string;
	tooltip?: ReactNode;
	style?: CSSProperties;
	after?: ReactNode;
} & MaybeWithClassName;

export const Label: FC<LabelType> = ({
	Component,
	className,
	tooltip,
	label,
	children,
	after,
	...props
}) => (
	<Component className={classNames(className, styles.component)} {...props}>
		<Body1 className={styles.label} Component="span" weight="bold">
			{label} {tooltip && <Tooltip size="medium">{tooltip}</Tooltip>}
		</Body1>
		{after && <div className={styles.after}>{after}</div>}
		{children && <div className={styles.children}>{children}</div>}
	</Component>
);
