import classNames from "classnames";

import { MaybeWithClassName, WithChildren } from "../../helper/react/types";

import styles from "./GutterBox.module.scss";

import type { FC, CSSProperties } from "react";

type GutterBoxType = {
	style?: CSSProperties;
};

export const GutterBox: FC<GutterBoxType & MaybeWithClassName & WithChildren> = ({
	className,
	children,
	...props
}) => {
	return (
		<div className={classNames(className, styles.component)} {...props}>
			{children}
		</div>
	);
};
