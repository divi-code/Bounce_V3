import classNames from "classnames";
import { FC, ReactNode } from "react";

import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { Button, PrimaryButton } from "@app/ui/button";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { Body1, Heading1 } from "@app/ui/typography";

import styles from "./VotePopUp.module.scss";

type PopUpType = {
	title: string;
	text: ReactNode;
	isLoading?: boolean;
	isSuccess?: boolean;
	isError?: boolean;
	onClose?(): void;
	onSuccess?(): void;
	onTry?(data: unknown): void;
};

export const Content: FC<PopUpType> = ({
	title,
	text,
	// isLoading,
	// isError,
	// isSuccess,
	// onSuccess,
	// onClose,
	// onTry,
}) => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				{title}
			</Heading1>
			<Body1 className={styles.text} lighten={50}>
				{text}
			</Body1>
		</div>
	);
};

export const VotePopUp: FC<
	PopUpType & {
		control: ScatteredContinuousState<boolean>;
		close(): void;
	}
> = ({ control, close, ...props }) => {
	return (
		<PopUpContainer
			animated={control.present}
			visible={control.defined}
			onClose={close}
			maxWidth={640}
			scrollable={false}
		>
			<Content onClose={close} {...props} />
			<control.DefinePresent />
		</PopUpContainer>
	);
};
