import classNames from "classnames";
import React, { FC } from "react";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./OTC.module.scss";

export const OTC: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>OTC</div>;
};
