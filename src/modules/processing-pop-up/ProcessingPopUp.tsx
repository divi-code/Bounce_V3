import classNames from "classnames";
import { FC, ReactNode } from "react";

import Lottie from "react-lottie";

import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { Button, PrimaryButton } from "@app/ui/button";

import { PopUpContainer } from "@app/ui/pop-up-container";
import { Spinner } from "@app/ui/spinner";
import { Body1, Heading1 } from "@app/ui/typography";

import styles from "./ProcessingPopUp.module.scss";
import bounce_loading from "./assets/bounce-loading.json";
import ERROR from "./assets/error.svg";
import SUCCESS from "./assets/success.svg";

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

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: bounce_loading,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
};

export const Content: FC<PopUpType> = ({
	title,
	text,
	isLoading,
	isError,
	isSuccess,
	onSuccess,
	onClose,
	onTry,
}) => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				{title}
			</Heading1>
			<div className={styles.image}>
				{isLoading && <Lottie classwidth={200} height={200} options={defaultOptions} />}
				{isSuccess && <img src={SUCCESS} alt="succes" />}
				{isError && <img src={ERROR} alt="error" />}
			</div>
			<Body1 className={styles.text} lighten={50}>
				{text}
			</Body1>
			<div className={classNames(styles.buttons, isError && styles.error)}>
				{isLoading && (
					<PrimaryButton
						size="large"
						iconBefore={<Spinner className={styles.spinner} size="small" />}
						disabled
					>
						Awaiting...
					</PrimaryButton>
				)}
				{isSuccess && (
					<PrimaryButton size="large" onClick={onSuccess}>
						Close
					</PrimaryButton>
				)}
				{isError && (
					<>
						<Button variant="outlined" color="primary-white" size="large" onClick={onClose}>
							Close
						</Button>
						<PrimaryButton size="large" onClick={onTry}>
							Try again
						</PrimaryButton>
					</>
				)}
			</div>
		</div>
	);
};

export const ProcessingPopUp: FC<
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
			withoutClose
			scrollable={false}
		>
			<Content onClose={close} {...props} />
			<control.DefinePresent />
		</PopUpContainer>
	);
};
