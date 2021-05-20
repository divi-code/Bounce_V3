import classNames from "classnames";

import styles from "./Scroll.module.scss";

export const ScrollBar = () => {
	return <div className={classNames(styles.bar)} />;
};

export const HorizontalScrollBar = () => {
	return <div className={classNames(styles.bar, styles.horizontal)} />;
};

export const TransparentHorizontalScrollBar = () => {
	return <div className={classNames(styles.bar, styles.horizontal, styles.transparent)} />;
};
