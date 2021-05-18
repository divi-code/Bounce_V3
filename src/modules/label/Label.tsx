import classNames from "classnames";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import { Tooltip } from "@app/ui/tooltip";
import { Body1 } from "@app/ui/typography";

import styles from "./Label.module.scss";

import type { CSSProperties, FC } from "react";

export type LabelType = {
	Component: "label" | "div";
	label: string;
	tooltip?: string;
	style?: CSSProperties;
} & WithChildren &
	MaybeWithClassName;

export const Label: FC<LabelType> = ({
	Component,
	className,
	tooltip,
	label,
	children,
	...props
}) => (
	<Component className={classNames(className, styles.component)} {...props}>
		<Body1 className={styles.label} Component="span" weight="bold">
			{label} {tooltip && <Tooltip size="medium">{tooltip}</Tooltip>}
		</Body1>
		{children}
	</Component>
);
