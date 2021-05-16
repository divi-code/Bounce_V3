import classNames from "classnames";
import React, { FC } from "react";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./Auction.module.scss";

export const Auction: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>Auction</div>;
};
