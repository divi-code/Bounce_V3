import React, { FC } from "react";
import styles from "./Auction.module.scss";
import { MaybeWithClassName } from "../../helper/react/types";
import classNames from "classnames";

export const Auction: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={classNames(className, styles.component)}>Auction</div>;
};
