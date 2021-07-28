import { FC } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { SelectTokenField } from "@app/modules/select-token-field";
import { Symbol } from "@app/modules/symbol";
import { TextField } from "@app/modules/text-field";

import { PrimaryButton } from "@app/ui/button";
import { FoldableSection } from "@app/ui/foldable-section";
import { RightArrow2 } from "@app/ui/icons/arrow-right-2";
import { RadioGroup } from "@app/ui/radio-group";
import { Body1 } from "@app/ui/typography";

import {
	composeValidators,
	isEqualZero,
	isNotGreaterThan,
	isValidWei,
} from "@app/utils/validation";

import styles from "./Fixed.module.scss";

type FixedViewType = {
	onSubmit(values): void;
	tokenFrom: string;
	balance: number;
	initialValues: any;
};

export enum ALLOCATION_TYPE {
	noLimits = "no-limits",
	limited = "limited",
}

const FLOAT = "0.0001";

export const FixedView: FC<MaybeWithClassName & FixedViewType> = ({
	onSubmit,
	tokenFrom,
	balance,
	initialValues,
}) => {
	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={initialValues}>
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
							1 <Symbol token={tokenFrom} /> =&nbsp;
							<TextField
								type="number"
								name="swapRatio"
								step={FLOAT}
								placeholder="0.00"
								after={<Currency token={props.values.tokenTo} />}
								validate={composeValidators(isEqualZero, isValidWei)}
								required
							/>
						</Body1>
					</Label>
				)}
			</FormSpy>
			<Label
				Component="label"
				label="Amount"
				tooltip="The amount of tokens that you want to put in for auction."
				after={
					<span className={styles.balance}>
						Balance: {balance} <Symbol token={tokenFrom} />
					</span>
				}
			>
				<TextField
					type="number"
					name="amount"
					placeholder="0.00"
					step={FLOAT}
					after={
						<div className={styles.amount}>
							<FormSpy>
								{({ form }) => (
									<button
										className={styles.max}
										onClick={() => form.change("amount", balance)}
										type="button"
									>
										MAX
									</button>
								)}
							</FormSpy>
							<Currency token={tokenFrom} />
						</div>
					}
					required
					validate={
						balance
							? composeValidators(isNotGreaterThan(balance), isEqualZero, isValidWei)
							: isEqualZero
					}
				/>
			</Label>
			<Label
				Component="div"
				label="Allocation per Wallet"
				tooltip="You can set a maximum allocation per wallet to prevent monopoly activities during the token swap. "
			>
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
								key={props.values.allocation}
								placeholder="0.00"
								step={FLOAT}
								after={<Currency token={props.values.tokenTo} />}
								required={props.values.allocation === "limited"}
								validate={
									props.values.allocation === "limited"
										? composeValidators(isEqualZero, isValidWei)
										: undefined
								}
							/>
						</Label>
					)
				}
			</FormSpy>
			<FormSpy>
				{(form) => (
					<PrimaryButton
						className={styles.submit}
						size="large"
						iconAfter={<RightArrow2 width={18} height="auto" style={{ marginLeft: 12 }} />}
						submit
					>
						{initialValues.amount && form.dirty ? "Save" : "Next Step"}
					</PrimaryButton>
				)}
			</FormSpy>
		</Form>
	);
};
