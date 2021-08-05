import React, { FC, useCallback, useState } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { DateField } from "@app/modules/date-field";
import { Form } from "@app/modules/form";
import { FormValidator } from "@app/modules/form/Form";
import { Label } from "@app/modules/label";
import { OnOffField } from "@app/modules/on-off-field";
import { RadioField } from "@app/modules/radio-field";
import { TextField } from "@app/modules/text-field";

import { WhiteListPopUp } from "@app/modules/whitelist-pop-up";
import { PrimaryButton } from "@app/ui/button";
import { RadioGroup } from "@app/ui/radio-group";

import { isNotLongerThan } from "@app/utils/validation";

import styles from "./ProvideAdvancedSettingsForAuction.module.scss";

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

export const ProvideAdvancedSettingsForAuction: FC<
	MaybeWithClassName & ProvideAdvancedSettingsType
> = ({ onSubmit, initialValues }) => {
	const [blockRef, setBlockRef] = useState<HTMLElement | null>(null);

	const [blockWidth, setBlockWidth] = useState(0);
	useResizeObserver(blockRef, (ref) => setBlockWidth(ref.clientWidth));

	const validate = useCallback((values) => {
		if (values.endPool < values.startPool) {
			return {
				endPool: "Should be after Start Time",
			};
		}

		if (values?.delayToken?.[0] === "unlock" && values.claimStart < values.endPool) {
			return {
				endPool: "Should be after End Time",
			};
		}

		return {};
	}, []);

	return (
		<Form
			onSubmit={onSubmit}
			className={styles.form}
			initialValues={initialValues}
			validate={validate}
		>
			<Label Component="div" label="Pool Name">
				<TextField type="text" name="poolName" required validate={isNotLongerThan(15)} />
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
							tooltip="Set a date so traders can only claim tokens by that time."
							after={<OnOffField name="delayToken" value="unlock" />}
						>
							{props.values.delayToken.includes("unlock") && (
								<DateField
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
			<Label
				Component="div"
				label="Whitelist"
				tooltip="Once activated, only traders you put in this whitelist can join your auction."
			>
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
							onSet={(list) => props.form.change("whiteListList" as any, list)}
						/>
					)
				}
			</FormSpy>
		</Form>
	);
};
