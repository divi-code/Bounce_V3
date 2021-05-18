import classNames from "classnames";

import { CSSProperties, FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./RadioGroup.module.scss";

export const RadioGroup: FC<MaybeWithClassName & { count: number }> = ({
	className,
	count,
	children,
}) => {
	return (
		<div
			className={classNames(className, styles.component)}
			style={{ "--count": count } as CSSProperties}
		>
			{children}
		</div>
	);
};
