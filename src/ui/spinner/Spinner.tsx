import classNames from "classnames";
import React from "react";
import type { FC } from "react";

import styles from "./Spinner.module.scss";
import { MaybeWithClassName } from "../../helper/react/types";

type SpinnerType = {
	color?: "default" | "white";
	size?: "medium" | "small";
};

export const Spinner: FC<SpinnerType & MaybeWithClassName> = ({
	className,
	color = "default",
	size = "medium",
}) => {
	return <div className={classNames(className, styles.component, styles[size], styles[color])} />;
};
