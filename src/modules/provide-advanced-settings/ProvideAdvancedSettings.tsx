import { FC, useState } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { DateField } from "@app/modules/date-field";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { TextField } from "@app/modules/text-field";

import { PrimaryButton } from "@app/ui/button";
import { RadioGroup } from "@app/ui/radio-group";

import styles from "./ProvideAdvancedSettings.module.scss";

type ProvideAdvancedSettingsType = {
	onSubmit(values): void;
};

export const ProvideAdvancedSettings: FC<MaybeWithClassName & ProvideAdvancedSettingsType> = ({
	onSubmit,
}) => {
	const [blockRef, setBlockRef] = useState<HTMLElement | null>(null);

	const [blockWidth, setBlockWidth] = useState(0);
	useResizeObserver(blockRef, (ref) => setBlockWidth(ref.clientWidth));

	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={{ whitelist: "yes" }}>
			<Label Component="div" label="Pool Name">
				<TextField type="text" name="poolName" required />
			</Label>
			<div ref={setBlockRef}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						alignItems: "start",
						gridColumnGap: "20px",
					}}
				>
					<Label Component="div" label="Start Time">
						<DateField
							placeholder="10.01.2021"
							name="startPool"
							min={new Date().toString()}
							dropdownWidth={`${blockWidth}px`}
							label="Choose start date"
							quickNav={["today", "tomorrow", "in-2-days"]}
						/>
					</Label>
					<FormSpy subscription={{ values: true }}>
						{(props) => (
							<>
								<Label Component="label" label="End Time">
									<DateField
										placeholder="10.01.2021"
										name="endPool"
										min={new Date(props.values.startPool).toString()}
										dropdownWidth={`${blockWidth}px`}
										dropdownPosition="right"
										label="Choose end date"
										quickNav={["in-5-days", "in-7-days", "in-10-days"]}
									/>
								</Label>
							</>
						)}
					</FormSpy>
				</div>
			</div>
			<Label Component="div" label="Whitelist" tooltip="Create new item">
				<RadioGroup count={2}>
					<RadioField name="whitelist" label="No" value="no" />
					<RadioField name="whitelist" label="Yes" value="yes" />
				</RadioGroup>
			</Label>
			<PrimaryButton className={styles.submit} size="large" submit>
				Create
			</PrimaryButton>
		</Form>
	);
};
