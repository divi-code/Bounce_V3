import classNames from "classnames";
import React, { FC } from "react";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./Farm.module.scss";

export const Farm: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>Farm</div>;
};
