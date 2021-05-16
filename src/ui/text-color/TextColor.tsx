import classNames from "classnames";

import { MaybeWithClassName, WithChildren } from "../../helper/react/types";
import styles from "../styles/Color.module.scss";

import { ColorType } from "../types";
import { getColorClassName } from "../utils/get-color-class-name";

import type { CSSProperties, FC } from "react";

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
