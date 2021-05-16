import classNames from "classnames";
import React from "react";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./Spinner.module.scss";

import type { FC } from "react";

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
