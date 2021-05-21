import classNames from "classnames";
import { FC } from "react";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";
import { GutterBox } from "@app/ui/gutter-box";
import { Body1, Heading1 } from "@app/ui/typography";

import styles from "./Search.module.scss";

type SearchType = {
	title: string;
	text: string;
	visibleText?: boolean;
};

export const Search: FC<SearchType & MaybeWithClassName & WithChildren> = ({
	className,
	title,
	text,
	children,
	visibleText,
}) => {
	return (
		<section className={classNames(className, styles.component)}>
			<GutterBox className={classNames(styles.wrapper, !visibleText && styles.withoutText)}>
				{visibleText && (
					<>
						<Heading1 Component="h2" className={styles.title} color="primary-white">
							{title}
						</Heading1>
						<Body1 className={styles.text} color="primary-white">
							{text}
						</Body1>
					</>
				)}
				<div className={styles.form}>{children}</div>
			</GutterBox>
		</section>
	);
};
