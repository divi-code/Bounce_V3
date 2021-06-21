import classNames from "classnames";

import { FC } from "react";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";
import { NavLink } from "@app/ui/button";

import { GutterBox } from "@app/ui/gutter-box";
import { Close } from "@app/ui/icons/close";
import { Caption, Heading1 } from "@app/ui/typography";

import styles from "./CreateSteps.module.scss";

type CreateStepsType = {
	count: number;
	title: string;
	type: string;
	currentStep: number;
	moveForward(): void;
	moveToStep(step: number): void;
};

export const CreateSteps: FC<CreateStepsType & MaybeWithClassName & WithChildren> = ({
	className,
	title,
	type,
	moveToStep,
	currentStep,
	count,
	children,
}) => {
	const buttons = new Array(count).fill("");

	return (
		<section className={className}>
			<GutterBox>
				<div className={styles.content}>
					<NavLink
						className={styles.close}
						variant="text"
						href="/"
						color="primary-black"
						icon={<Close width={24} height="auto" />}
					>
						Close
					</NavLink>
					<Caption Component="span" lighten={50}>
						{type}
					</Caption>
					<div className={styles.header}>
						<Heading1 Component="h2" className={styles.title}>
							{title}
						</Heading1>
						<ul className={styles.list}>
							{buttons.map((_, index) => (
								<li key={index}>
									<button
										className={classNames(
											styles.navigation,
											index === currentStep && styles.active
										)}
										onClick={() => moveToStep(index)}
										disabled={index >= currentStep}
									>
										{index + 1}
									</button>
								</li>
							))}
						</ul>
					</div>
					<div className={styles.body}>{children}</div>
				</div>
			</GutterBox>
		</section>
	);
};
