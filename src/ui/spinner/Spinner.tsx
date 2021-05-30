import classNames from "classnames";
import React from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./Spinner.module.scss";

import type { FC } from "react";

type SpinnerType = {
	size?: "medium" | "small";
};

export const Spinner: FC<SpinnerType & MaybeWithClassName> = ({ className, size = "medium" }) => {
	return <div className={classNames(className, styles.component, styles[size])} />;
};
