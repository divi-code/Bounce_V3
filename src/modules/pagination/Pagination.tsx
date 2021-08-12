import classNames from "classnames";
import { FC } from "react";
import { uid } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Button } from "@app/ui/button";

import { RightArrow } from "@app/ui/icons/arrow-right";
import { Body1 } from "@app/ui/typography";

import styles from "./Pagination.module.scss";

type PaginationType = {
	numberOfPages: number;
	currentPage: number;
	onBack?(): void;
	onNext?(): void;
};

export const Pagination: FC<PaginationType & MaybeWithClassName> = ({
	className,
	numberOfPages,
	currentPage,
	onBack,
	onNext,
}) => {
	return (
		<div className={classNames(className, styles.component)}>
			<ol className={styles.list}>
				<li>
					<Button
						className={styles.button}
						onClick={onBack}
						disabled={currentPage === 0}
						icon={<RightArrow style={{ width: 6, transform: `rotate(180deg)` }} />}
					>
						Back
					</Button>
				</li>
				{Array(1)
					.fill(1)
					.map((x) => (
						<li key={uid(x)}>
							<Button className={classNames(styles.button, styles.active)} disabled>
								{currentPage + 1}
							</Button>
						</li>
					))}
				<li>
					<Button
						className={styles.button}
						onClick={onNext}
						disabled={currentPage === numberOfPages - 1}
						icon={<RightArrow style={{ width: 6 }} />}
					>
						Next
					</Button>
				</li>
			</ol>
			<Body1 Component="span" lighten={50}>
				{currentPage + 1} of {numberOfPages}
			</Body1>
		</div>
	);
};
