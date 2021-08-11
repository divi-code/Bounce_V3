import { FC } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { SelectTokenField } from "@app/modules/select-token-field";
import { Symbol } from "@app/modules/symbol";
import { TextField } from "@app/modules/text-field";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { PrimaryButton } from "@app/ui/button";
import { RightArrow2 } from "@app/ui/icons/arrow-right-2";
import { Body1 } from "@app/ui/typography";

import {
	composeValidators,
	isEqualZero,
	isNotGreaterThan,
	isValidWei,
} from "@app/utils/validation";

import styles from "./Selling.module.scss";

type SellingViewType = {
	onSubmit(values): void;
	tokenFrom: string;
	balance: number;
	initialValues: any;
};

const FLOAT = "0.0001";

export const SellingView: FC<MaybeWithClassName & SellingViewType> = ({
	onSubmit,
	tokenFrom,
	balance,
	initialValues,
}) => {
	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={initialValues}>
			<Alert
				title={
					<span
						style={{
							display: "inline-grid",
							gridAutoFlow: "column",
							alignItems: "center",
							gridColumnGap: 12,
						}}
					>
						You are selling <Currency token={tokenFrom} />
					</span>
				}
				type={ALERT_TYPE.default}
			/>
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
										onClick={() => form.change("amount", balance.toString())}
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

			<Label Component="div" label="Receipt Currency">
				<SelectTokenField
					name="tokenTo"
					placeholder="Select a token you want to be paid"
					required
				/>
			</Label>

			<FormSpy subscription={{ values: true }}>
				{(props) => (
					<Label Component="label" label="Unit Price">
						<Body1 Component="div" className={styles.swap}>
							1 <Symbol token={tokenFrom} /> ={"\u00a0"}
							<TextField
								type="number"
								name="unitPrice"
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
