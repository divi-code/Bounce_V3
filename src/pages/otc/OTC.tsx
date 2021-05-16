import React, { FC } from "react";
import styles from "./OTC.module.scss";
import { MaybeWithClassName } from "../../helper/react/types";
import classNames from "classnames";

export const OTC: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>OTC</div>;
};
