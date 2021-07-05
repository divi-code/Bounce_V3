import { FC, useState } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { DateField } from "@app/modules/date-field";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { TextField } from "@app/modules/text-field";

import { WhiteListPopUp } from "@app/modules/whitelist-pop-up";
import { PrimaryButton } from "@app/ui/button";
import { RadioGroup } from "@app/ui/radio-group";

import { isNotLongerThan } from "@app/utils/validation";

import styles from "./ProvideAdvancedSettingsForOTC.module.scss";

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

export const ProvideAdvancedSettingsForOTC: FC<
	MaybeWithClassName & ProvideAdvancedSettingsType
> = ({ onSubmit, initialValues }) => {
	const [blockRef, setBlockRef] = useState<HTMLElement | null>(null);

	const [blockWidth, setBlockWidth] = useState(0);
	useResizeObserver(blockRef, (ref) => setBlockWidth(ref.clientWidth));

	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={initialValues}>
			<Label Component="div" label="Pool Name">
				<TextField type="text" name="poolName" required validate={isNotLongerThan(15)} />
			</Label>
			<div ref={setBlockRef}>
				<Label Component="div" label="Start Time">
					<DateField
						placeholder="10.01.2021"
						name="startPool"
						min={getDateIntervalStart(new Date()).toString()}
						dropdownWidth={`${blockWidth}px`}
						labels={["1. Choose start date", "2. Choose start time"]}
						quickNav={["today", "tomorrow", "in-2-days"]}
						required
					/>
				</Label>
			</div>
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
