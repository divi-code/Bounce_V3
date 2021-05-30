import { FC, useState } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { CheckboxField } from "@app/modules/checkbox-field";
import { DateField } from "@app/modules/date-field";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { OnOffField } from "@app/modules/on-off-field ";
import { RadioField } from "@app/modules/radio-field";
import { TextField } from "@app/modules/text-field";

import { PrimaryButton } from "@app/ui/button";
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
										min={new Date().toString()}
										selection={{
											start: new Date(props.values.startPool),
											end: new Date(props.values.endPool),
										}}
										dropdownWidth={`${blockWidth}px`}
										label="Choose start date"
										quickNav={["today", "tomorrow", "in-2-days"]}
										required
									/>
								</Label>

								<Label Component="div" label="End Time">
									<DateField
										placeholder="10.01.2021"
										name="endPool"
										min={new Date(props.values.startPool).toString()}
										selection={{
											start: new Date(props.values.startPool),
											end: new Date(props.values.endPool),
										}}
										dropdownWidth={`${blockWidth}px`}
										dropdownPosition="right"
										label="Choose end date"
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
							{props.values.delayToken.includes("unlock") ? (
								<DateField
									placeholder="10.01.2021"
									name="claimStart"
									min={new Date(props.values.startPool).toString()}
									label="Choose date"
									quickNav={["in-5-days", "in-7-days", "in-10-days"]}
									required
								/>
							) : undefined}
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
		</Form>
	);
};
