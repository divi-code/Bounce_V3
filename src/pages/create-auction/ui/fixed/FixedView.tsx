import { FC } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { SelectTokenField } from "@app/modules/select-token-field";
import { TextField } from "@app/modules/text-field";

import { PrimaryButton } from "@app/ui/button";
import { RightArrow2 } from "@app/ui/icons/arrow-right-2";
import { RadioGroup } from "@app/ui/radio-group";
import { Body1 } from "@app/ui/typography";

import styles from "./Fixed.module.scss";

type FixedViewType = {
	onSubmit(values): void;
	tokenFrom: string;
	balance: string;
};

export enum ALLOCATION_TYPE {
	noLimits = "no-limits",
	limited = "limited",
}

export const FixedView: FC<MaybeWithClassName & FixedViewType> = ({
	onSubmit,
	tokenFrom,
	balance,
}) => {
	return (
		<Form
			onSubmit={onSubmit}
			className={styles.form}
			initialValues={{ tokenFrom: tokenFrom, allocation: "limited" }}
		>
			<div className={styles.group}>
				<Label Component="div" label="From">
					<SelectTokenField name="tokenFrom" required readOnly />
				</Label>
				<Label Component="div" label="To">
					<SelectTokenField name="tokenTo" placeholder="Select a token" required />
				</Label>
			</div>
			<FormSpy subscription={{ values: true }}>
				{(props) => (
					<Label Component="label" label="Swap Ratio">
						<Body1 Component="div" className={styles.swap}>
							1 {tokenFrom} ={"\u00a0"}
							<TextField
								type="number"
								name="swapRatio"
								placeholder="0.00"
								after={<Currency token={props.values.tokenTo} />}
								required
							/>
						</Body1>
					</Label>
				)}
			</FormSpy>
			<Label Component="label" label="Amount" tooltip="Create new item">
				<TextField
					type="number"
					name="amount"
					placeholder="0.00"
					after={<Currency token={tokenFrom} />}
					required
				/>
			</Label>
			<Label Component="div" label="Allocation per Wallet" tooltip="Create new item">
				<RadioGroup count={2} fixed={true}>
					<RadioField name="allocation" label="No Limits" value={ALLOCATION_TYPE.noLimits} />
					<RadioField name="allocation" label="Limited" value={ALLOCATION_TYPE.limited} />
				</RadioGroup>
			</Label>
			<FormSpy subscription={{ values: true }}>
				{(props) =>
					props.values.allocation === "limited" && (
						<Label Component="label" label="Limit">
							<TextField
								type="text"
								name="limit"
								placeholder="0.00"
								after={<Currency token={tokenFrom} />}
								required
							/>
						</Label>
					)
				}
			</FormSpy>
			<PrimaryButton
				className={styles.submit}
				size="large"
				iconAfter={<RightArrow2 width={18} height="auto" style={{ marginLeft: 12 }} />}
				submit
			>
				Next Step
			</PrimaryButton>
		</Form>
	);
};
