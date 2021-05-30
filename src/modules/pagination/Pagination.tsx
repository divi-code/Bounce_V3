import classNames from "classnames";
import { FC } from "react";
import { uid } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Button } from "@app/ui/button";

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
	console.log(numberOfPages);

	return (
		<div className={classNames(className, styles.component)}>
			<ol className={styles.list}>
				<li className={styles.item}>
					<Button className={styles.button} onClick={onBack} disabled={currentPage === 0}>
						Back
					</Button>
				</li>
				{Array(1)
					.fill(1)
					.map((x) => (
						<li className={styles.pagination__item} key={uid(x)}>
							<Button className={classNames(styles.button)} disabled>
								{currentPage + 1}
							</Button>
						</li>
					))}
				<li className={styles.pagination__item}>
					<Button
						className={styles.pagination__button}
						onClick={onNext}
						disabled={currentPage === numberOfPages}
					>
						Next
					</Button>
				</li>
			</ol>
		</div>
	);
};
