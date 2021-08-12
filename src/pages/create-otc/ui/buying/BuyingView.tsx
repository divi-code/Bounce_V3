import { useWeb3React } from "@web3-react/core";
import { FC, useEffect, useState } from "react";

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

import { fromWei } from "@app/utils/bn/wei";
import { composeValidators, isEqualZero, isValidWei } from "@app/utils/validation";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import { isEth } from "@app/web3/api/eth/use-eth";
import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Buying.module.scss";

type BuyingViewType = {
	onSubmit(values): void;
	tokenFrom: string;
	balance: number;
	initialValues: any;
};

const FLOAT = "0.0001";

export const BuyingView: FC<MaybeWithClassName & BuyingViewType> = ({
	onSubmit,
	tokenFrom,
	balance,
	initialValues,
}) => {
	const [tokenTo, setTokenTo] = useState("");
	const [newBalance, setNewBalance] = useState(0);
	const findToken = useTokenSearch();
	const web3 = useWeb3();
	const provider = useWeb3Provider();
	const { account } = useWeb3React();
	const tokenContract = getTokenContract(provider, findToken(tokenTo)?.address);

	useEffect(() => {
		if (!tokenTo) {
			return;
		}

		if (!isEth(findToken(tokenTo).address)) {
			getBalance(tokenContract, account).then((b) =>
				setNewBalance(parseFloat(fromWei(b, findToken(tokenTo).decimals).toFixed(6, 1)))
			);
		} else {
			getEthBalance(web3, account).then((b) =>
				setNewBalance(parseFloat(fromWei(b, findToken(tokenTo).decimals).toFixed(4, 1)))
			);
		}
	}, [web3, tokenContract, account, findToken, tokenTo]);

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
						You are buying <Currency token={tokenFrom} small />
					</span>
				}
				type={ALERT_TYPE.default}
			/>
			<Label Component="div" label="Payment Currency">
				<SelectTokenField name="tokenTo" placeholder="Select a token you want to pay" required />
			</Label>
			<FormSpy subscription={{ values: true }}>
				{(props) => {
					props.values.tokenTo && setTokenTo(props.values.tokenTo);

					return (
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
					);
				}}
			</FormSpy>
			<FormSpy subscription={{ values: true }}>
				{(props) => (
					<Label
						Component="label"
						label="Buying Amount"
						tooltip="The amount of tokens that you want to put in for auction."
						after={
							<span className={styles.balance}>
								Balance: {newBalance} <Symbol token={props.values.tokenTo} />
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
												onClick={() =>
													form.change(
														"amount",
														props.values.unitPrice
															? (newBalance / props.values.unitPrice).toString()
															: 0
													)
												}
												type="button"
											>
												MAX
											</button>
										)}
									</FormSpy>
									<Currency token={tokenFrom} small />
								</div>
							}
							validate={composeValidators(isEqualZero, isValidWei)}
							required
						/>
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
