import React, { FC } from "react";
import styles from "./Farm.module.scss";
import { MaybeWithClassName } from "../../helper/react/types";
import classNames from "classnames";

export const Farm: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>Farm</div>;
};
