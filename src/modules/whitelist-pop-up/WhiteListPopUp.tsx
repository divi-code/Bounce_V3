import React, { ChangeEvent, FC, useEffect } from "react";

import { useCallbackState } from "use-callback-state";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { PrimaryButton } from "@app/ui/button";
import { PopUpContainer } from "@app/ui/pop-up-container";

import { Body1, Heading1, Heading2 } from "@app/ui/typography";

import styles from "./WhiteListPopUp.module.scss";

const EMPTY_ARRAY = [];

type ContentType = {
	value?: string;
	setValue?(event: ChangeEvent<HTMLTextAreaElement>): void;
	setList?(): void;
};

export const Content: FC<ContentType> = ({ value, setValue, setList }) => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Import whitelist
			</Heading1>
			<Body1 className={styles.text}>
				Enter one address on each line. You can entry 300
				<br /> addresses as maximum.
			</Body1>
			<textarea
				className={styles.textarea}
				placeholder="Enter addresses"
				value={value}
				onChange={setValue}
				rows={7}
			/>
			<PrimaryButton onClick={setList} size="large">
				Confirm
			</PrimaryButton>
		</div>
	);
};

export const WhiteListPopUp: FC<{
	onSet(list: string[]): void;
	initialValue?: string[];
}> = ({ onSet, initialValue = EMPTY_ARRAY }) => {
	const { open, close, popUp } = useControlPopUp();

	useEffect(() => {
		open();
	}, [open]);

	const [value, setValue] = useCallbackState(
		initialValue.join("\n"),
		(event: ChangeEvent<HTMLTextAreaElement>) => event.target.value
	);

	const setList = () => {
		onSet(value.split("\n"));
		close();
	};

	return (
		<PopUpContainer
			animated={popUp.present}
			visible={popUp.defined}
			onClose={close}
			maxWidth={640}
			withoutClose
		>
			<Content value={value} setValue={setValue} setList={setList} />
			<popUp.DefinePresent />
		</PopUpContainer>
	);
};
