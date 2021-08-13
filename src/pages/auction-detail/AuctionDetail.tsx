import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { FormProps } from "react-final-form";

import { POOL_ADDRESS_MAPPING, POOL_TYPE } from "@app/api/pool/const";
// import { IToken } from "@app/api/types";
import { IToken } from "@app/api/types";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { Timer } from "@app/modules/timer";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { Caption } from "@app/ui/typography";
import { isLessThan } from "@app/utils/bn";
import { fromWei, numToWei, weiToNum } from "@app/utils/bn/wei";
import { getMatchedPool, MatchedPoolType, POOL_STATUS } from "@app/utils/pool";
import { getDeltaTime } from "@app/utils/time";
// import { isEqualZero } from "@app/utils/validation";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import {
	approveAuctionPool,
	creatorClaim,
	getAllowance,
	getBouncePoolContract,
	getCreatorClaimed,
	getLimitAmount,
	getMyAmount0,
	// getMyAmount1,
	getMyClaimed,
	getPools,
	getWhitelistedStatus,
	swapContracts,
	userClaim,
} from "@app/web3/api/bounce/pool";
import { isEth } from "@app/web3/api/eth/use-eth";
import { useTokenQuery } from "@app/web3/api/tokens";
import {
	useAccount,
	useChainId,
	useConnected,
	useWeb3,
	useWeb3Provider,
} from "@app/web3/hooks/use-web3";

import styles from "./AuctionDetail.module.scss";
import { Claim } from "./Claim";
import { PlaceBid } from "./PlaceBid";
import { View } from "./View";
import { getAlertForOwner, getAlertForUsers } from "./getAlerts";

type AlertType = {
	title: string;
	text: string;
	type: ALERT_TYPE;
};

enum OPERATION {
	default = "default",
	loading = "loading",
	pending = "pending",
	confirmed = "confirmed",
	approved = "approved",
	placed = "completed",
	claimed = "claimed",
	failed = "failed",
	canceled = "canceled",
}

enum ACTION {
	claim = "claim",
	place = "place-bit",
}

const TITLE = {
	[OPERATION.loading]: "Loading",
	[OPERATION.approved]: "Bounce requests wallet approval",
	[OPERATION.confirmed]: "Bounce requests wallet interaction",
	[OPERATION.pending]: "Bounce waiting for transaction settlement",
	[OPERATION.placed]: "Congratulations!",
	[OPERATION.claimed]: "Settlement",
	[OPERATION.failed]: "Transaction failed on Bounce",
	[OPERATION.canceled]: "Transaction canceled on Bounce",
};

const CONTENT = {
	[OPERATION.loading]: "Loading process..",
	[OPERATION.approved]: "Please manually interact with your wallet",
	[OPERATION.confirmed]:
		"Please open your wallet and confirm in the transaction activity to proceed your order",
	[OPERATION.pending]:
		"Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement",
	[OPERATION.placed]:
		"You have successfully participated in this prediction. Please come back to check results when the prediction pool is closed",
	[OPERATION.claimed]:
		"Thanks for using Bounce Finance to create your auction. Your last auction is settled and you can create another one.",
	[OPERATION.failed]:
		"Oops! Your transaction is failed for on-chain approval and settlement. Please initiate another transaction",
	[OPERATION.canceled]: "Sorry! Your transaction is canceled. Please try again.",
};

export const AuctionDetail: FC<{ poolID: number; auctionType: POOL_TYPE }> = ({
	poolID,
	auctionType,
}) => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const queryToken = useTokenQuery();
	const isConnected = useConnected();
	const account = useAccount();
	const web3 = useWeb3();

	const [pool, setPool] = useState<MatchedPoolType>();

	const [userWhitelisted, setUserWhitelisted] = useState<boolean>(false);
	const [userPlacedAmount0, setUserPlacedAmount0] = useState<number>(0);
	const [userPlacedAmount1, setUserPlacedAmount1] = useState<number>(0);
	const [userClaimed, setUserClaimed] = useState<boolean>(false);
	const [creatorClaimed, setCreatorClaimed] = useState<boolean>(false);

	const [limited, setLimited] = useState<boolean>(undefined);
	const [limit, setLimit] = useState<number>(undefined);

	const [isCreator, setCreator] = useState<boolean>(false);
	const [balance, setBalance] = useState<string | undefined>("");

	const [to, setTo] = useState(undefined);

	const contract = useMemo(
		() => getBouncePoolContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId),
		[auctionType, chainId, provider]
	);

	const updateData = useCallback(async () => {
		if (!contract) {
			return;
		}

		//get pool info

		const pool = await getPools(contract, poolID);

		if (!pool) {
			// @ts-ignore
			alert("cannot find Pool");

			return;
		}

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);
		const limit = await getLimitAmount(contract, poolID);
		const userBid = await getMyAmount0(contract, account, poolID);
		// const userPay = await getMyAmount1(contract, account, poolID);
		// console.log('userBid',userBid)  // 100000000000000000
		// console.log('userPay',userPay)	// 0
		const whitelistStatus = await getWhitelistedStatus(contract, poolID, account);
		const creatorClaim = await getCreatorClaimed(contract, account, poolID);
		const userClaim = await getMyClaimed(contract, account, poolID);
		const matchedPool = await getMatchedPool(
			contract,
			from,
			to,
			pool,
			poolID,
			auctionType,
			account
		);
		setPool(matchedPool);
		setTo(to);
		setUserPlacedAmount0(parseFloat(weiToNum(userBid, from.decimals)));
		// setUserPlacedAmount1(parseFloat(weiToNum(userPay, to.decimals)));
		setCreatorClaimed(!!creatorClaim);
		setUserWhitelisted(matchedPool.whitelist ? whitelistStatus : true);
		setLimited(parseFloat(weiToNum(limit, to.decimals, 6)) > 0);
		setCreator(pool.creator === account);

		setLimit(
			parseFloat(weiToNum(limit, to.decimals, 6)) - parseFloat(weiToNum(userBid, from.decimals, 6))
		);

		if (!isEth(to.address)) {
			const tokenContract = getTokenContract(provider, to.address);

			getBalance(tokenContract, account).then((b) =>
				setBalance(parseFloat(fromWei(b, to.decimals).toFixed(6, 1)).toString())
			);
		} else {
			getEthBalance(web3, account).then((b) =>
				setBalance(parseFloat(fromWei(b, to.decimals).toFixed(4, 1)).toString())
			);
		}

		// 用户是否 Claimed 情况判断
		// 1. userClaim 没有了 claim 的余额
		// 2. 如果是不锁仓的池子，默认看做自动 claim 了
		// 3. 如果作为创建者 池子 faild 了，也是不需要 calim 的
		const isLockout = Number(pool.claimAt) !== 0;
		// const isCreatorFaild =
		setUserClaimed(!!userClaim || (!isLockout && !isCreator));
	}, [account, auctionType, contract, poolID, provider, queryToken, web3]);

	const onRequestData = updateData;

	useEffect(() => {
		if (isConnected) {
			updateData();
		}
	}, [isConnected, updateData]);

	useEffect(() => {
		const tm = setInterval(updateData, 60000);

		return () => clearInterval(tm);
	}, [updateData]);

	const [operation, setOperation] = useState(OPERATION.default);
	const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

	//place a bid

	const bidAction: FormProps["onSubmit"] = async (values, form) => {
		const operation = async () => {
			try {
				setOperation(OPERATION.approved);

				const value = numToWei(values.bid, to.decimals, 0);

				if (!isEth(to.address)) {
					const tokenContract = getTokenContract(provider, to.address);

					const allowance = await getAllowance(
						tokenContract,
						POOL_ADDRESS_MAPPING[auctionType],
						chainId,
						account
					);

					if (isLessThan(allowance, value)) {
						const result = await approveAuctionPool(
							tokenContract,
							POOL_ADDRESS_MAPPING[auctionType],
							chainId,
							account,
							value
						);

						if (!result.status) {
							setOperation(OPERATION.failed);

							return;
						}
					}
				}

				setOperation(OPERATION.confirmed);

				await swapContracts(contract, value, account, poolID, !isEth(to.address) ? "0" : value)
					.on("transactionHash", (h) => {
						setOperation(OPERATION.pending);
					})
					.on("receipt", (r) => {
						setOperation(OPERATION.placed);
						updateData();
						form.change("bid", undefined);
						setLastOperation(null);
					})
					.on("error", (e) => {
						setOperation(OPERATION.failed);
					});
			} catch (e) {
				if (e.code === 4001) {
					setOperation(OPERATION.canceled);
				} else {
					setOperation(OPERATION.failed);
				}
			} finally {
				// close modal
			}
		};

		setLastOperation(() => operation);

		return operation();
	};

	//claim action for creator

	const claimForCreator = async () => {
		const operation = async () => {
			try {
				setOperation(OPERATION.loading);

				await creatorClaim(contract, account, poolID)
					.on("transactionHash", (h) => {
						setOperation(OPERATION.pending);
					})
					.on("receipt", (r) => {
						setOperation(OPERATION.claimed);
						updateData();
						setLastOperation(null);
					})
					.on("error", (e) => {
						setOperation(OPERATION.failed);
					});
			} catch (e) {
				if (e.code === 4001) {
					setOperation(OPERATION.canceled);
				} else {
					setOperation(OPERATION.failed);
				}
			} finally {
				// close modal
			}
		};

		setLastOperation(() => operation);

		return operation();
	};

	//claim action for user

	const claimForUser = async () => {
		const operation = async () => {
			try {
				setOperation(OPERATION.loading);

				await userClaim(contract, account, poolID)
					.on("transactionHash", (h) => {
						setOperation(OPERATION.pending);
					})
					.on("receipt", (r) => {
						setOperation(OPERATION.claimed);
						updateData();
						setLastOperation(null);
					})
					.on("error", (e) => {
						setOperation(OPERATION.failed);
					});
			} catch (e) {
				if (e.code === 4001) {
					setOperation(OPERATION.canceled);
				} else {
					setOperation(OPERATION.failed);
				}
			} finally {
				// close modal
			}
		};

		setLastOperation(() => operation);

		return operation();
	};

	const tryAgainAction = () => {
		if (lastOperation) {
			lastOperation();
		}
	};

	const { popUp, close, open } = useControlPopUp();

	useEffect(() => {
		if (operation !== OPERATION.default) {
			open();
		}
	}, [open, operation]);

	//set action

	const [hasStart, setHasStart] = useState(false);

	useEffect(() => {
		if (getDeltaTime(pool?.openAt) > 0) {
			setHasStart(false);
		} else {
			setHasStart(true);
		}
	}, [pool]);

	const [action, setAction] = useState<ACTION>(undefined);

	useEffect(() => {
		if (pool) {
			if (isCreator) {
				setAction(ACTION.claim);
			} else if (pool.status === POOL_STATUS.FILLED || pool.status === POOL_STATUS.CLOSED) {
				setAction(ACTION.claim);
			} else {
				setAction(ACTION.place);
			}
		}
	}, [isCreator, pool]);

	//set title

	const [title, setTitle] = useState<string>(undefined);

	useEffect(() => {
		if (isCreator) {
			setTitle("My Pool");
		} else if (userPlacedAmount0) {
			setTitle("You Joined");
		} else {
			setTitle("Join The Pool");
		}
	}, [userPlacedAmount0, isCreator]);

	//set alerts

	const [alert, setAlert] = useState<AlertType | undefined>();

	useEffect(() => {
		if (pool) {
			if (isCreator) {
				setAlert(
					getAlertForOwner(pool.openAt, pool.closeAt, pool.amount, pool.total, creatorClaimed)
				);
			} else {
				setAlert(
					getAlertForUsers(
						userWhitelisted,
						pool.openAt,
						pool.closeAt,
						pool.amount,
						pool.total,
						!!userPlacedAmount0,
						userClaimed,
						pool.claimAt
					)
				);
			}
		}
	}, [creatorClaimed, isCreator, pool, userClaimed, userPlacedAmount0, userWhitelisted]);

	const { back: goBack } = useRouter();

	if (!pool) {
		return null;
	}

	// console.log('pool', pool)
	return (
		<>
			<View
				status={pool.status}
				id={pool.id}
				type={pool.type}
				from={pool.from as any}
				to={pool.to as any}
				total={pool.total}
				amount={pool.amount}
				name={pool.name}
				price={pool.price}
				fill={pool.fill}
				openAt={+pool.openAt}
				closeAt={+pool.closeAt}
				onZero={onRequestData}
				actionTitle={title}
				claimAt={pool.claimAt ? new Date(+pool.claimAt) : undefined}
				limit={pool.limit}
				alert={alert && <Alert title={alert.title} text={alert.text} type={alert.type} />}
				onBack={() => goBack()}
			>
				{action === ACTION.claim && (
					<Claim
						userBid={userPlacedAmount0}
						userPay={userPlacedAmount1}
						from={pool.from as any}
						to={pool.to as any}
						price={pool.price}
						amount={pool.amount}
						isNonAction={
							userClaimed ||
							(pool.status !== POOL_STATUS.CLOSED && isCreator) ||
							(pool.status === POOL_STATUS.FILLED && !userPlacedAmount0 && !isCreator) ||
							(pool.status === POOL_STATUS.CLOSED && !userPlacedAmount0 && !isCreator) ||
							(pool.fill === 100 && isCreator)
						}
						disabled={
							operation === OPERATION.loading ||
							getDeltaTime(pool.claimAt) > 0 ||
							(isCreator && creatorClaimed) ||
							(!isCreator && !userPlacedAmount0) ||
							(!isCreator && !userWhitelisted)
						}
						loading={operation === OPERATION.loading}
						onClick={isCreator ? claimForCreator : claimForUser}
					>
						{isCreator && (creatorClaimed ? "Tokens claimed" : "Claim your unswapped tokens")}
						{!isCreator &&
							(pool && userClaimed ? (
								"Tokens claimed"
							) : (
								<>
									Claim Token
									{getDeltaTime(pool?.claimAt) > 0 && (
										<Caption
											className={styles.timer}
											Component="span"
											style={{ color: "inherit" }}
											weight="regular"
										>
											<Timer timer={pool?.claimAt} onZero={onRequestData} />
										</Caption>
									)}
								</>
							))}
					</Claim>
				)}
				{action === ACTION.place && (
					<PlaceBid
						currency={pool.to.address}
						balance={balance}
						limit={limit}
						isLimit={limited}
						disabled={
							operation === OPERATION.loading ||
							pool.status === POOL_STATUS.COMING ||
							!userWhitelisted
						}
						loading={operation === OPERATION.loading}
						onSubmit={bidAction}
					>
						<>
							{hasStart ? "Place a Bid" : "Auction will be live in"}
							{pool.status === POOL_STATUS.COMING && (
								<Caption
									className={styles.timer}
									Component="span"
									style={{ color: "inherit" }}
									weight="regular"
								>
									<Timer
										timer={pool.openAt}
										onZero={() => {
											setHasStart(true);
											onRequestData();
										}}
									/>
								</Caption>
							)}
						</>
					</PlaceBid>
				)}
			</View>
			{popUp.defined ? (
				<ProcessingPopUp
					title={TITLE[operation]}
					text={CONTENT[operation]}
					onSuccess={() => {
						setOperation(OPERATION.default);
						close();
					}}
					onTry={tryAgainAction}
					isSuccess={operation === OPERATION.claimed || operation === OPERATION.placed}
					isLoading={
						operation === OPERATION.loading ||
						operation === OPERATION.pending ||
						operation === OPERATION.confirmed ||
						operation === OPERATION.approved
					}
					isError={operation === OPERATION.failed || operation === OPERATION.canceled}
					control={popUp}
					close={() => {
						close();
						setOperation(OPERATION.default);
					}}
				/>
			) : undefined}
		</>
	);
};
