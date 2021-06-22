import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { FormProps } from "react-final-form";

import { POOL_ADDRESS_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { FailedPopUp } from "@app/modules/failed";
import { SuccessPopUp } from "@app/modules/success";
import { Timer } from "@app/modules/timer";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { Caption } from "@app/ui/typography";
import { isLessThan } from "@app/utils/bn";
import { numToWei, weiToNum } from "@app/utils/bn/wei";
import { getMatchedPool, MatchedPoolType, POOL_STATUS } from "@app/utils/pool";
import { getDeltaTime } from "@app/utils/time";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import {
	approveAuctionPool,
	creatorClaim,
	getAllowance,
	getBouncePoolContract,
	getCreatorClaimed,
	getLimitAmount,
	getMyAmount0,
	getMyClaimed,
	getPools,
	getWhitelistedStatus,
	swapContracts,
	userClaim,
} from "@app/web3/api/bounce/pool";
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
	approved = "approved",
	approvalFailed = "approved-failed",
	completed = "completed",
	failed = "failed",
}

enum ACTION {
	claim = "claim",
	place = "place-bit",
}

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
	const [userPlaced, setUserPlaced] = useState<boolean>(false);
	const [userClaimed, setUserClaimed] = useState<boolean>(false);
	const [creatorClaimed, setCreatorClaimed] = useState<boolean>(false);

	const [limited, setLimited] = useState<boolean>(undefined);
	const [limit, setLimit] = useState<number>(undefined);

	const [isCreator, setCreator] = useState<boolean>(false);
	const [balance, setBalance] = useState<string | undefined>("");

	const [to, setTo] = useState(undefined);

	const [isETH, setETH] = useState(false);

	const contract = useMemo(
		() => getBouncePoolContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId),
		[auctionType, chainId, provider]
	);

	useEffect(() => {
		if (to && to.address === "0x0000000000000000000000000000000000000000") {
			setETH(true);
		}
	}, [to]);

	useEffect(() => {
		if (to) {
			if (!isETH) {
				const tokenContract = getTokenContract(provider, to.address);
				getBalance(tokenContract, account).then((b) => setBalance(weiToNum(b, to.decimals, 6)));
			} else {
				getEthBalance(web3, account).then((b) => setBalance(weiToNum(b, to.decimals, 6)));
			}
		}
	}, [account, to, provider, web3, isETH]);

	const updateData = useCallback(async () => {
		if (!contract) {
			return;
		}

		//get pool info

		const pool = await getPools(contract, poolID);

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);
		const limit = await getLimitAmount(contract, poolID);
		const userBid = await getMyAmount0(contract, account, poolID);
		const whitelistStatus = await getWhitelistedStatus(contract, poolID, account);
		const creatorClaim = await getCreatorClaimed(contract, account, poolID);
		const userClaim = await getMyClaimed(contract, account, poolID);

		const matchedPool = await getMatchedPool(contract, from, to, pool, poolID, auctionType);

		setPool(matchedPool);
		setTo(to);
		setUserPlaced(parseFloat(weiToNum(userBid, to.decimals, 6)) > 0);
		setUserClaimed(!!userClaim);
		setCreatorClaimed(!!creatorClaim);
		setUserWhitelisted(matchedPool.whitelist ? whitelistStatus : true);
		setLimited(parseFloat(weiToNum(limit, to.decimals, 6)) > 0);
		setCreator(pool.creator === account);

		setLimit(
			parseFloat(weiToNum(limit, to.decimals, 6)) - parseFloat(weiToNum(userBid, to.decimals, 6))
		);
	}, [account, auctionType, contract, poolID, queryToken]);

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
				const value = numToWei(values.bid, to.decimals, 0);
				setOperation(OPERATION.loading);
				console.log("value", value);

				if (!isETH) {
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
							setOperation(OPERATION.approvalFailed);

							return;
						}
					}
				}

				await swapContracts(contract, value, account, poolID, !isETH ? "0" : value);

				setOperation(OPERATION.completed);
				await updateData();
				form.change("bid", undefined);
				setLastOperation(null);
			} catch (e) {
				console.error("failed to place a bit", e);
				setOperation(OPERATION.failed);

				return {
					// report to final form
					error: "error",
				};
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
				await creatorClaim(contract, account, poolID);
				setOperation(OPERATION.completed);
				await updateData();
				setLastOperation(null);
			} catch (e) {
				console.error("failed to claim", e);
				setOperation(OPERATION.failed);

				return {
					// report to final form
					error: "error",
				};
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
				await userClaim(contract, account, poolID);
				setOperation(OPERATION.completed);
				await updateData();
				setLastOperation(null);
			} catch (e) {
				console.error("failed to stake", e);
				setOperation(OPERATION.failed);

				return {
					// report to final form
					error: "error",
				};
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

	//success place a bid
	const { popUp: successPopUp, close: successClose, open: successOpen } = useControlPopUp();

	useEffect(() => {
		if (operation === OPERATION.completed) {
			successOpen();
		}
	}, [successOpen, operation]);

	//failed
	const { popUp: failedPopUp, close: failedClose, open: failedOpen } = useControlPopUp();

	useEffect(() => {
		if (operation === OPERATION.failed) {
			failedOpen();
		} else {
			failedClose();
		}
	}, [operation, failedOpen, failedClose]);

	//set action

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
		} else if (userPlaced) {
			setTitle("You Joined");
		} else {
			setTitle("Join The Pool");
		}
	}, [userPlaced, isCreator]);

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
						userPlaced,
						userClaimed
					)
				);
			}
		}
	}, [creatorClaimed, isCreator, pool, userClaimed, userPlaced, userWhitelisted]);

	const { back: goBack } = useRouter();

	if (pool) {
		return (
			<>
				<View
					status={pool.status}
					id={pool.id}
					address={pool.address}
					type={pool.type}
					token={pool.token}
					total={pool.total}
					amount={pool.amount}
					name={pool.name}
					currency={pool.currency}
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
							token={pool.token}
							price={pool.price}
							currency={pool.currency}
							amount={pool.amount}
							isNonAction={
								userClaimed ||
								(pool.status !== POOL_STATUS.CLOSED && isCreator) ||
								(pool.status === POOL_STATUS.FILLED && !userPlaced && !isCreator) ||
								(pool.status === POOL_STATUS.CLOSED && !userPlaced && !isCreator)
							}
							disabled={
								operation === OPERATION.loading ||
								getDeltaTime(pool.claimAt) > 0 ||
								(isCreator && creatorClaimed) ||
								(!isCreator && !userPlaced) ||
								(!isCreator && !userWhitelisted)
							}
							loading={operation === OPERATION.loading}
							onClick={isCreator ? claimForCreator : claimForUser}
						>
							{isCreator && (creatorClaimed ? "Tokens claimed" : "Claim your unswapped tokens")}
							{!isCreator &&
								(userClaimed ? (
									"Tokens claimed"
								) : (
									<>
										Claim Token
										{getDeltaTime(pool.claimAt) > 0 && (
											<Caption
												className={styles.timer}
												Component="span"
												style={{ color: "inherit" }}
												weight="regular"
											>
												<Timer timer={pool.claimAt} onZero={onRequestData} />
											</Caption>
										)}
									</>
								))}
						</Claim>
					)}
					{action === ACTION.place && (
						<PlaceBid
							currency={pool.currency}
							balance={parseFloat(balance)}
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
								Place a Bid{" "}
								{pool.status === POOL_STATUS.COMING && (
									<Caption
										className={styles.timer}
										Component="span"
										style={{ color: "inherit" }}
										weight="regular"
									>
										<Timer timer={pool.openAt} onZero={onRequestData} />
									</Caption>
								)}
							</>
						</PlaceBid>
					)}
				</View>
				{failedPopUp.defined ? (
					<FailedPopUp
						control={failedPopUp}
						close={() => {
							failedClose();
							setOperation(OPERATION.default);
						}}
						onClick={tryAgainAction}
					/>
				) : null}
				{successPopUp.defined ? (
					<SuccessPopUp
						control={successPopUp}
						close={() => {
							successClose();
							setOperation(OPERATION.default);
						}}
					/>
				) : null}
			</>
		);
	}

	return null;
};
