import { FormApi } from "final-form";
import { FC } from "react";
import { FormSpy } from "react-final-form";

import { WithChildren } from "@app/helper/react/types";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { Symbol } from "@app/modules/symbol";
import { TextField } from "@app/modules/text-field";

import { PrimaryButton } from "@app/ui/button";
import { Spinner } from "@app/ui/spinner";

import { isGreaterThanOrEqualTo } from "@app/utils/bn";

import styles from "./PlaceBid.module.scss";

type OtcDetailPlaceBidType = {
	disabled: boolean;
	loading: boolean;
	currency: string;
	balance: string;
	onSubmit(values: Record<string, any>, form: FormApi): void;
	totalAmount: number;
};

const FLOAT = "0.0001";

export const PlaceBid: FC<OtcDetailPlaceBidType & WithChildren> = ({
	disabled,
	loading,
	children,
	balance,
	currency,
	onSubmit,
	totalAmount,
}) => {
	return (
		<Form onSubmit={onSubmit} className={styles.component}>
			<Label
				label="Your OTC Amount"
				Component="label"
				after={
					<>
						Balance {balance} {<Symbol token={currency} />}
					</>
				}
			>
				<TextField
					name="bid"
					type="number"
					step={FLOAT}
					after={
						<div className={styles.amount}>
							<FormSpy>
								{({ form }) => (
									<button
										className={styles.max}
										onClick={() => {
											if (isGreaterThanOrEqualTo(balance, totalAmount)) {
												form.change("bid", totalAmount);
											} else {
												form.change("bid", balance);
											}
										}}
										type="button"
									>
										MAX
									</button>
								)}
							</FormSpy>
							<Currency token={currency} />
						</div>
					}
				/>
			</Label>
			<PrimaryButton className={styles.button} size="large" submit disabled={disabled}>
				{loading ? <Spinner size="small" /> : children}
			</PrimaryButton>
		</Form>
	);
};
