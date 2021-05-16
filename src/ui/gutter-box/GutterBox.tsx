import classNames from "classnames";
import type { FC, CSSProperties } from "react";

import styles from "./GutterBox.module.scss";
import { MaybeWithClassName, WithChildren } from "../../helper/react/types";

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
