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
import { isGreaterThan } from "@app/utils/bn";
import { isNotGreaterThan } from "@app/utils/validation";

import styles from "./PlaceBid.module.scss";

type AuctionDetailPlaceBidType = {
	isLimit: boolean;
	limit: number;
	disabled: boolean;
	loading: boolean;
	currency: string;
	balance: string;
	onSubmit(values: Record<string, any>, form: FormApi): void;
};

const FLOAT = "0.0001";

export const PlaceBid: FC<AuctionDetailPlaceBidType & WithChildren> = ({
	isLimit,
	limit,
	disabled,
	loading,
	children,
	balance,
	currency,
	onSubmit,
}) => {
	return (
		<Form onSubmit={onSubmit} className={styles.component}>
			<Label
				label="Your Bid Amount"
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
					max={isLimit ? limit : undefined}
					after={
						<div className={styles.amount}>
							<FormSpy>
								{({ form }) => (
									<button
										className={styles.max}
										onClick={() => {
											if (!isLimit) {
												// 如果是无限制的，则填充用户的余额
												form.change("bid", balance);
											} else {
												// 如果是有限制的
												//  首先判断用户还可以购买多少
												if (isGreaterThan(balance, limit)) {
													// 如果余额充足
													form.change("bid", limit);
												} else {
													// 如果余额不够
													form.change("bid", balance);
												}
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
					validate={isLimit && isNotGreaterThan(limit)}
				/>
			</Label>
			<PrimaryButton className={styles.button} size="large" submit disabled={disabled}>
				{loading ? <Spinner size="small" /> : children}
			</PrimaryButton>
		</Form>
	);
};
