import classNames from "classnames";
import type { CSSProperties, FC } from "react";

import styles from "../styles/Color.module.scss";
import { getColorClassName } from "../utils/get-color-class-name";
import { ColorType } from "../types";
import { MaybeWithClassName, WithChildren } from "../../helper/react/types";

type TextColorType = { color: ColorType; style?: CSSProperties };

export const TextColor: FC<TextColorType & MaybeWithClassName & WithChildren> = ({
	className,
	color,
	children,
	...props
}) => {
	return (
		<span className={classNames(className, getColorClassName(color, styles))} {...props}>
			{children}
		</span>
	);
};
