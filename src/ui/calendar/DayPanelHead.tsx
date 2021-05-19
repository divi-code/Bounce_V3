import classNames from "classnames";
import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Body1 } from "@app/ui/typography";

import styles from "./DayPanelHead.module.scss";
import { WEEKDAYS_NAMES } from "./const";

export const DayPanelHead: FC<MaybeWithClassName> = ({ className }) => (
	<div className={classNames(className, styles.component)}>
		<ol className={styles.list}>
			{WEEKDAYS_NAMES.map((item, index) => (
				<Body1 Component="li" key={item + index} className={styles.item} lighten={40}>
					{item}
				</Body1>
			))}
		</ol>
	</div>
);
