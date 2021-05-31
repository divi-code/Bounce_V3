import React, { ChangeEvent, FC, useEffect, useState } from "react";

import { FormSpy } from "react-final-form";

import { useCallbackState } from "use-callback-state";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { DateField } from "@app/modules/date-field";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { OnOffField } from "@app/modules/on-off-field ";
import { RadioField } from "@app/modules/radio-field";
import { TextField } from "@app/modules/text-field";

import { PrimaryButton } from "@app/ui/button";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { RadioGroup } from "@app/ui/radio-group";

import styles from "./ProvideAdvancedSettings.module.scss";

type ProvideAdvancedSettingsType = {
	onSubmit(values): void;
	initialValues: any;
};

export enum WHITELIST_TYPE {
	yes = "yes",
	no = "no",
}

const getDateIntervalStart = (from: Date) => {
	return new Date(from.getFullYear(), from.getMonth(), from.getDate());
};

const EMPTY_ARRAY = [];

const WhiteListPopUp: FC<{
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
		<PopUpContainer animated={popUp.present} visible={popUp.defined} onClose={close}>
			<textarea placeholder={"xxx-xxx-xxx"} value={value} onChange={setValue} />
			<PrimaryButton onClick={setList}>Confirm</PrimaryButton>
			<popUp.DefinePresent />
		</PopUpContainer>
	);
};

export const ProvideAdvancedSettings: FC<MaybeWithClassName & ProvideAdvancedSettingsType> = ({
	onSubmit,
	initialValues,
}) => {
	const [blockRef, setBlockRef] = useState<HTMLElement | null>(null);

	const [blockWidth, setBlockWidth] = useState(0);
	useResizeObserver(blockRef, (ref) => setBlockWidth(ref.clientWidth));

	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={initialValues}>
			<Label Component="div" label="Pool Name">
				<TextField type="text" name="poolName" required />
			</Label>
			<div ref={setBlockRef}>
				<div className={styles.period}>
					<FormSpy subscription={{ values: true }}>
						{(props) => (
							<>
								<Label Component="div" label="Start Time">
									<DateField
										placeholder="10.01.2021"
										name="startPool"
										min={getDateIntervalStart(new Date()).toString()}
										selection={{
											start: getDateIntervalStart(new Date(props.values.startPool)),
											end: getDateIntervalStart(new Date(props.values.endPool)),
										}}
										dropdownWidth={`${blockWidth}px`}
										labels={["1. Choose start date", "2. Choose start time"]}
										quickNav={["today", "tomorrow", "in-2-days"]}
										required
									/>
								</Label>

								<Label Component="div" label="End Time">
									<DateField
										placeholder="10.01.2021"
										name="endPool"
										min={getDateIntervalStart(new Date(props.values.startPool)).toString()}
										selection={{
											start: getDateIntervalStart(new Date(props.values.startPool)),
											end: getDateIntervalStart(new Date(props.values.endPool)),
										}}
										dropdownWidth={`${blockWidth}px`}
										dropdownPosition="right"
										labels={["1. Choose end date", "2. Choose end time"]}
										quickNav={["in-5-days", "in-7-days", "in-10-days"]}
										required
									/>
								</Label>
							</>
						)}
					</FormSpy>
				</div>
			</div>
			<FormSpy subscription={{ values: true }}>
				{(props) => (
					<>
						<Label
							Component="div"
							label="Delay Unlocking Token"
							tooltip="Create new item"
							after={<OnOffField name="delayToken" value="unlock" />}
						>
							{props.values.delayToken.includes("unlock") && (
								<DateField
									key={props.values.claimStart}
									placeholder="10.01.2021"
									name="claimStart"
									min={getDateIntervalStart(new Date(props.values.startPool)).toString()}
									labels={["1. Choose date", "2. Choose time"]}
									quickNav={["in-5-days", "in-7-days", "in-10-days"]}
									required={props.values.delayToken.includes("unlock")}
								/>
							)}
						</Label>
					</>
				)}
			</FormSpy>
			<Label Component="div" label="Whitelist" tooltip="Create new item">
				<RadioGroup count={2} fixed>
					<RadioField name="whitelist" label="No" value={WHITELIST_TYPE.no} />
					<RadioField name="whitelist" label="Yes" value={WHITELIST_TYPE.yes} />
				</RadioGroup>
			</Label>
			<PrimaryButton className={styles.submit} size="large" submit>
				Create
			</PrimaryButton>
			<FormSpy subscription={{ values: true }}>
				{(props) =>
					props.values.whitelist === WHITELIST_TYPE.yes && (
						<WhiteListPopUp
							initialValue={props.values.whitelistList}
							onSet={(list) => props.form.change("whitelistList" as any, list)}
						/>
					)
				}
			</FormSpy>
		</Form>
	);
};
