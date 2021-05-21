import classNames from "classnames";
import { Fragment } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Caption, Heading3 } from "@app/ui/typography";

import styles from "./DescriptionList.module.scss";

import type { FC, ReactNode } from "react";

type DescriptionListType = {
	title: string;
	data: Record<string, ReactNode>;
};

export const DescriptionList: FC<DescriptionListType & MaybeWithClassName> = ({
	className,
	title,
	data,
}) => {
	return (
		<div className={classNames(className, styles.component)}>
			<Heading3 Component="h3" className={styles.title}>
				{title}
			</Heading3>
			<dl className={styles.list}>
				{Object.keys(data).map((key) => (
					<Fragment key={key}>
						<Caption Component="dt" lighten={50}>
							{key}
						</Caption>
						<Caption Component="dd" className={styles.desc} lighten={90}>
							{data[key]}
						</Caption>
					</Fragment>
				))}
			</dl>
		</div>
	);
};
