import React, { FC } from "react";
import styles from "./About.module.scss";
import { MaybeWithClassName } from "../../helper/react/types";
import classNames from "classnames";

export const About: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>About</div>;
};
