import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { StakePopUp } from "@app/modules/stake-pop-up";
import { Button } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";
import { ShortLogo } from "@app/ui/icons/short-logo";
import { toWei, weiToNum } from "@app/utils/bn/wei";
import BounceERC20ABI from "@app/web3/api/bounce/BounceERC20.abi.json";
import bounceStake from "@app/web3/api/bounce/bounceStake.abi.json";
import { getAuctionAddress, getStakingAddress } from "@app/web3/api/bounce/contractAddress";
import { getContract } from "@app/web3/contracts/helpers";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import { MaybeWithClassName } from "../../helper/react/types";

import { StakeBody, UnStakeBody, ClaimBody } from "./ContentComponents";

import styles from "./Farm.module.scss";
import { OPERATION, TITLE, CONTENT } from "./stakingModal";

export const Farm: FC<MaybeWithClassName> = ({ className }) => {
	const [type, setType] = useState("");
	const [operationAgain, setOperationAgain] = useState<(() => void) | null>(null);
	const [operationStatus, setOperationStatus] = useState(OPERATION.default);
	const [auctionBalance, setAuctionBalance] = useState();
	const [rewards, setRewards] = useState();
	const [stakedAmount, setStakedAmount] = useState();
	const [stakedTotal, setStakedTotal] = useState();
	const [hasExchanged, setHasExchanged] = useState(true);
	const { open: openStake, close: closeStake, popUp: stakePopUp } = useControlPopUp();
	const { open: openProcess, close: closeProcess, popUp: processPopUp } = useControlPopUp();
	const { account, active } = useWeb3React();
	const chainId = useChainId();
	const provider = useWeb3Provider();
	const auctionContract = getContract(provider, BounceERC20ABI.abi, getAuctionAddress(chainId));
	const stakingContract = getContract(provider, bounceStake.abi, getStakingAddress(chainId));

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const loadAuctionStaking = () => {
		try {
			auctionContract.methods
				.balanceOf(account)
				.call()
				.then((res) => {
					setAuctionBalance(res);
				});
		} catch (err) {
			console.log("balanceOf error:", err);
		}

		try {
			stakingContract.methods
				.calculateRewardInBot(account)
				.call()
				.then((res) => {
					setRewards(res);
				});
		} catch (err) {
			console.log("calculateRewardInBot error:", err);
		}

		try {
			stakingContract.methods
				.myTotalStake(account)
				.call()
				.then((res) => {
					setStakedAmount(res);
				});
		} catch (err) {
			console.log("myTotalStake error:", err);
		}

		try {
			stakingContract.methods
				.totalStake()
				.call()
				.then((res) => {
					setStakedTotal(res);
				});
		} catch (err) {
			console.log("totalStake error:", err);
		}

		try {
			stakingContract.methods
				.hasExchanged(account)
				.call()
				.then((res) => {
					setHasExchanged(res);
				});
		} catch (err) {
			console.log("hasExchanged", err);
		}
	};

	const handlePopUp = (type: string) => {
		setType(type);
		openStake();
	};

	const handleSubmit = async (amount) => {
		const operationSubmit = async () => {
			switch (type) {
				case "stake":
					handleStake(amount);
					break;
				case "unStake":
					handleUnStake(amount);
					break;
				case "claim":
					handleClaim();
					break;
			}
		};

		setOperationAgain(() => operationSubmit);

		return operationSubmit();
	};

	const handleStake = async (amount) => {
		setOperationStatus(OPERATION.approval);
		openProcess();

		const weiAmount = toWei(amount, 18);

		try {
			const result = await auctionContract.methods
				.approve(getStakingAddress(chainId), weiAmount)
				.send({ from: account });

			if (result.status) {
				setOperationStatus(OPERATION.confirm);

				await stakingContract.methods
					.staking(weiAmount)
					.send({ from: account })
					.on("transactionHash", () => {
						setOperationStatus(OPERATION.pending);
						!processPopUp.defined && openProcess();
					})
					.on("receipt", () => {
						setOperationStatus(OPERATION.successStake);
						setOperationAgain(null);
						!processPopUp.defined && openProcess();
					})
					.on("error", () => {
						setOperationStatus(OPERATION.error);
						!processPopUp.defined && openProcess();
					});
			}
		} catch (e) {
			if (e.code === 4001) {
				setOperationStatus(OPERATION.cancel);
				!processPopUp.defined && openProcess();
			} else {
				setOperationStatus(OPERATION.error);
				!processPopUp.defined && openProcess();
			}
		}
	};

	const handleUnStake = async (amount) => {
		const weiAmount = toWei(amount, 18);
		setOperationStatus(OPERATION.confirm);
		openProcess();

		try {
			await stakingContract.methods
				.unStaking(weiAmount)
				.send({ from: account })
				.on("transactionHash", () => {
					setOperationStatus(OPERATION.pending);
					!processPopUp.defined && openProcess();
				})
				.on("receipt", () => {
					setOperationStatus(OPERATION.successUnStake);
					!processPopUp.defined && openProcess();
				})
				.on("error", () => {
					setOperationStatus(OPERATION.error);
					!processPopUp.defined && openProcess();
				});
		} catch (err) {
			if (err.code === 4001) {
				setOperationStatus(OPERATION.cancel);
				!processPopUp.defined && openProcess();
			} else {
				setOperationStatus(OPERATION.error);
				!processPopUp.defined && openProcess();
			}
		}
	};

	const handleClaim = async () => {
		setOperationStatus(OPERATION.confirm);
		openProcess();

		try {
			await stakingContract.methods
				.claimReward()
				.send({ from: account })
				.on("transactionHash", () => {
					setOperationStatus(OPERATION.pending);
					!processPopUp.defined && openProcess();
				})
				.on("receipt", () => {
					setOperationStatus(OPERATION.successClaim);
					!processPopUp.defined && openProcess();
				})
				.on("error", () => {
					setOperationStatus(OPERATION.error);
					!processPopUp.defined && openProcess();
				});
		} catch (err) {
			if (err.code === 4001) {
				setOperationStatus(OPERATION.cancel);
				!processPopUp.defined && openProcess();
			} else {
				setOperationStatus(OPERATION.error);
				!processPopUp.defined && openProcess();
			}
		}
	};

	useEffect(() => {
		if (active) {
			loadAuctionStaking();
		}
	}, [active, loadAuctionStaking]);

	const tryAgainAction = () => {
		operationAgain && operationAgain();
	};

	return (
		<div className={classNames(className, styles.component)}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.headLeftContent}>
							<span className={styles.logoIcon}>
								<ShortLogo style={{ width: 9, height: 14, color: "#fff" }} />
							</span>
							<span className={styles.logoTit}>Auction</span>
						</div>
						<div className={styles.headRightContent}>
							<span className={styles.label}>APY</span>
							<span className={styles.value}>30%</span>
						</div>
					</div>
					<div className={styles.rewardWrap}>
						<div className={styles.rewardsLable}>
							<span>Your Staking Rewards Estimation</span>
							<Button style={{ color: "#2E57F7" }} onClick={() => handlePopUp("claim")}>
								Claim Rewards
							</Button>
						</div>
						<div className={styles.rewardsValue}>
							<span>{rewards && weiToNum(rewards, 18, 2)}</span>
							<span>Auction</span>
						</div>
						<div className={styles.buttons}>
							<Button
								size="large"
								color="primary-black"
								variant="contained"
								onClick={() => handlePopUp("stake")}
							>
								Stake
							</Button>
							<Button
								size="large"
								color="primary-black"
								variant="contained"
								onClick={() => handlePopUp("unStake")}
							>
								Unstake
							</Button>
						</div>
						<div className={styles.amountWrapper}>
							<div className={styles.amountItem}>
								<span>Your Stake</span>
								<span>
									{stakedAmount &&
										(hasExchanged ? weiToNum(stakedAmount) : Number(weiToNum(stakedAmount)) * 100)}
								</span>
							</div>
							<div className={styles.amountItem}>
								<span>Pooled Total</span>
								<span>{stakedTotal && weiToNum(stakedTotal)}</span>
							</div>
						</div>
					</div>
					{stakePopUp.defined && (
						<StakePopUp popUp={stakePopUp} onClose={closeStake}>
							{type === "stake" && (
								<StakeBody
									amount={auctionBalance}
									stakeAmount={stakedAmount}
									onSubmit={handleSubmit}
									onClose={closeStake}
								/>
							)}
							{type === "unStake" && (
								<UnStakeBody
									stakeAmount={stakedAmount}
									onSubmit={handleSubmit}
									onClose={closeStake}
								/>
							)}
							{type === "claim" && (
								<ClaimBody
									amount={rewards}
									stakeAmount={stakedAmount}
									onSubmit={handleSubmit}
									onClose={closeStake}
								/>
							)}
						</StakePopUp>
					)}
					{processPopUp.defined && (
						<ProcessingPopUp
							title={TITLE[operationStatus]}
							text={CONTENT[operationStatus]}
							onSuccess={() => {
								setOperationStatus(OPERATION.default);
								closeProcess();
							}}
							onTry={tryAgainAction}
							isSuccess={
								operationStatus === OPERATION.successClaim ||
								operationStatus === OPERATION.successStake ||
								operationStatus === OPERATION.successUnStake
							}
							isLoading={
								operationStatus === OPERATION.approval ||
								operationStatus === OPERATION.pending ||
								operationStatus === OPERATION.confirm
							}
							isError={operationStatus === OPERATION.error || operationStatus === OPERATION.cancel}
							control={processPopUp}
							close={() => {
								closeProcess();
								setOperationStatus(OPERATION.default);
							}}
						/>
					)}
				</div>
			</GutterBox>
		</div>
	);
};
