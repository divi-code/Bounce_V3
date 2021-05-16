import classNames from "classnames";
import React, { FC } from "react";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./About.module.scss";

export const About: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>About</div>;
};
