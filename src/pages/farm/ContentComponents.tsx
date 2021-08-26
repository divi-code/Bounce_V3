import React, { FC } from "react";

import { FormSpy } from "react-final-form";

import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import styles from "@app/modules/stake-pop-up/StakePopUp.module.scss";
import { TextField } from "@app/modules/text-field";
import { PrimaryButton } from "@app/ui/button";
import { ShortLogo } from "@app/ui/icons/short-logo";
import { Heading1 } from "@app/ui/typography";
import { weiToNum } from "@app/utils/bn/wei";
import { composeValidators, isEqualZero, isValidWei } from "@app/utils/validation";

const FLOAT = "0.0001";
interface IContent {
	onSubmit(amount?: string): void;
	onClose(): void;
	amount?: number;
	stakeAmount: number;
}

export const StakeBody: FC<IContent> = ({ onClose, onSubmit, amount, stakeAmount }) => {
	const handleSubmit = (values) => {
		onClose();
		onSubmit(values.amount);
	};

	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Stake Tokens
			</Heading1>
			<Form onSubmit={handleSubmit} className={styles.form}>
				<FormSpy subscription={{ values: true }}>
					{() => (
						<Label
							Component="label"
							label="Amount"
							after={
								<span className={styles.balance}>
									Balance: {amount && weiToNum(amount.toString())} Auction
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
													onClick={() => form.change("amount", weiToNum(amount.toString()))}
													type="button"
												>
													MAX
												</button>
											)}
										</FormSpy>
										<div className={styles.coinWrapper}>
											<span className={styles.logoIcon}>
												<ShortLogo style={{ width: 9, height: 14, color: "#fff" }} />
											</span>
											<span className={styles.coin}>Auction</span>
										</div>
									</div>
								}
								validate={composeValidators(isEqualZero, isValidWei)}
								required
							/>
						</Label>
					)}
				</FormSpy>
				<PrimaryButton size="large" submit>
					Stake Auction
				</PrimaryButton>
			</Form>
			<div className={styles.amountItem}>
				<span>Your Auction Staked</span>
				<span>{weiToNum(stakeAmount.toString())}</span>
			</div>
		</div>
	);
};

export const UnStakeBody: FC<IContent> = ({ onClose, onSubmit, stakeAmount }) => {
	const handleSubmit = (values) => {
		onClose();
		onSubmit(values.amount);
	};

	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Unstake Tokens
			</Heading1>
			<Form onSubmit={handleSubmit} className={styles.form}>
				<FormSpy subscription={{ values: true }}>
					{() => (
						<Label
							Component="label"
							label="Amount"
							after={
								<span className={styles.balance}>
									Balance: {stakeAmount && weiToNum(stakeAmount.toString())} Auction
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
													onClick={() => form.change("amount", weiToNum(stakeAmount.toString()))}
													type="button"
												>
													MAX
												</button>
											)}
										</FormSpy>
										<div className={styles.coinWrapper}>
											<span className={styles.logoIcon}>
												<ShortLogo style={{ width: 9, height: 14, color: "#fff" }} />
											</span>
											<span className={styles.coin}>Auction</span>
										</div>
									</div>
								}
								validate={composeValidators(isEqualZero, isValidWei)}
								required
							/>
						</Label>
					)}
				</FormSpy>
				<PrimaryButton size="large" submit>
					Unstake Auction
				</PrimaryButton>
			</Form>
			<div className={styles.amountItem}>
				<span>Your Auction Staked</span>
				<span>{weiToNum(stakeAmount.toString())}</span>
			</div>
		</div>
	);
};

export const ClaimBody: FC<IContent> = ({ onClose, onSubmit, amount, stakeAmount }) => {
	const handleSubmit = () => {
		onClose();
		onSubmit();
	};

	return (
		<div className={styles.component}>
			<div className={styles.claimTitle}>Your total staking rewards:</div>
			<div className={styles.rewardsWrap}>
				<span>{weiToNum(amount.toString(), 18, 6)}</span>
				<span>Auction</span>
			</div>
			<PrimaryButton size="large" onClick={handleSubmit}>
				Claim
			</PrimaryButton>
			<div className={styles.amountItem}>
				<span>Your Auction Staked</span>
				<span>{weiToNum(stakeAmount.toString())}</span>
			</div>
		</div>
	);
};

export const StakeCancelBody: FC = () => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Staking Cancelled
			</Heading1>
			<div className={styles.cancelDesc}>Your staking was cancelled and wasn’t submitted.</div>
			<PrimaryButton size="large">Try again</PrimaryButton>
		</div>
	);
};
