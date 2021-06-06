import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { FormProps, FormSpy } from "react-final-form";

import { POOL_ADDRESS_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { TextField } from "@app/modules/text-field";
import { Timer } from "@app/modules/timer";
import { DisplayPoolInfoType } from "@app/pages/auction";
import { AuctionDetailInfo } from "@app/pages/auction-detail/AuctionDetailInfo";
import { AuctionDetailView } from "@app/pages/auction-detail/AuctionDetailView";
import { getAlertForOwner } from "@app/pages/auction-detail/getAlerts";

import { getMatchedPool } from "@app/pages/auction-detail/getMatchedPool";
import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { PrimaryButton } from "@app/ui/button";
import { Spinner } from "@app/ui/spinner";
import { Caption } from "@app/ui/typography";
import { numToWei, weiToNum } from "@app/utils/bn/wei";
import { POOL_STATUS } from "@app/utils/pool";
import { getDeltaTime } from "@app/utils/time";
import { isNotGreaterThan } from "@app/utils/validation";
import {
	creatorClaim,
	getBalance,
	getBounceContract,
	getEthBalance,
	getLimitAmount,
	getMyAmount1,
	getPools,
	getTokenContract,
	getWhitelistedStatus,
	swapContracts,
	userClaim,
} from "@app/web3/api/bounce/contract";
import { useTokenQuery } from "@app/web3/api/tokens";
import {
	useAccount,
	useChainId,
	useConnected,
	useWeb3,
	useWeb3Provider,
} from "@app/web3/hooks/use-web3";

import styles from "./AuctionDetail.module.scss";

type AlertType = {
	title: string;
	text: string;
	type: ALERT_TYPE;
};

const FLOAT = "0.0001";

enum OPERATION {
	default = "default",
	loading = "loading",
	approved = "approved",
	approvalFailed = "approved-failed",
	completed = "completed",
	failed = "failed",
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

	const [pool, setPool] = useState<
		DisplayPoolInfoType & {
			amount: string;
			openAt: number;
			closeAt: number;
			creator: string;
			claimAt?: number;
			limit?: string;
		}
	>();
	const [isWhitelisted, setWhitelisted] = useState<boolean>(false);
	const [myBid, setMyBid] = useState<number>(undefined);
	const [myClaimed, setMyClaimed] = useState<boolean>(false);
	const [creatorClaimed, setCreatorClaimed] = useState<boolean>(false);
	const [myLimit, setMyLimit] = useState<number>(undefined);
	const [myPool, setMyPool] = useState<boolean>(false);
	const [alert, setAlert] = useState<AlertType | undefined>();
	const [balance, setBalance] = useState<string | undefined>("");

	const [to, setTo] = useState(undefined);

	const contract = useMemo(
		() => getBounceContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId),
		[auctionType, chainId, provider]
	);

	useEffect(() => {
		if (to) {
			if (to.symbol !== "ETH") {
				const tokenContract = getTokenContract(provider, to.address);
				getBalance(tokenContract, account).then((b) => setBalance(weiToNum(b, to.decimals, 6)));
			} else {
				getEthBalance(web3, account).then((b) => setBalance(weiToNum(b, to.decimals, 6)));
			}
		}
	}, [account, to, provider, web3]);

	const updateData = useCallback(async () => {
		if (!contract) {
			return;
		}

		//get pool info

		const pool = await getPools(contract, poolID);

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);
		const limit = await getLimitAmount(contract, poolID);
		const bid = await getMyAmount1(contract, account, poolID);
		const whitelistStatus = await getWhitelistedStatus(contract, poolID, account);

		const matchedPool = await getMatchedPool(contract, from, to, pool, poolID, auctionType);

		setPool(matchedPool);
		setTo(to);
		setMyBid(parseFloat(weiToNum(bid, to.decimals, 6)));
		setMyClaimed(!!userClaim);
		setCreatorClaimed(!!creatorClaim);
		setWhitelisted(pool.whitelist ? whitelistStatus : true);

		setMyLimit(
			parseFloat(weiToNum(limit, to.decimals, 6)) - parseFloat(weiToNum(bid, to.decimals, 6))
		);

		if (pool.creator === account) {
			setMyPool(true);
		}

		//set alerts

		if (pool.creator === account) {
			setAlert(
				getAlertForOwner(
					matchedPool.openAt,
					matchedPool.closeAt,
					matchedPool.amount,
					matchedPool.total
				)
			);
		}
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

	const getTitle = () => {
		if (!myPool) {
			if (myBid > 0) {
				return "You Joined";
			} else return "Join The Pool";
		} else return "My Pool";
	};

	const [operation, setOperation] = useState(OPERATION.default);
	const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

	const bidAction: FormProps["onSubmit"] = async (values, form) => {
		const operation = async () => {
			try {
				setOperation(OPERATION.loading);
				await swapContracts(contract, numToWei(values.bid, to.decimals, 0), account, poolID);
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

	if (pool) {
		return (
			<AuctionDetailView
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
				actionTitle={getTitle()}
				claimAt={pool.claimAt ? new Date(+pool.claimAt) : undefined}
				limit={parseFloat(pool.limit)}
				alert={alert && <Alert title={alert.title} text={alert.text} type={alert.type} />}
			>
				{myPool && (
					<div className={styles.claim}>
						<AuctionDetailInfo
							token={pool.token}
							price={pool.price}
							currency={pool.currency}
							amount={pool.amount}
						/>
						{pool.status === POOL_STATUS.CLOSED && (
							<PrimaryButton
								className={styles.cta}
								size="large"
								onClick={claimForCreator}
								disabled={creatorClaimed || operation === OPERATION.loading}
							>
								{creatorClaimed ? "Tokens claimed" : "Claim your unswapped tokens"}
							</PrimaryButton>
						)}
					</div>
				)}
				{!myPool && (pool.status === POOL_STATUS.FILLED || pool.status === POOL_STATUS.CLOSED) && (
					<div className={styles.claim}>
						<AuctionDetailInfo
							token={pool.token}
							price={pool.price}
							currency={pool.currency}
							amount={pool.amount}
						/>
						<PrimaryButton
							className={styles.cta}
							size="large"
							disabled={
								getDeltaTime(pool.claimAt) > 0 || operation === OPERATION.loading || myClaimed
							}
							onClick={claimForUser}
						>
							{myClaimed ? (
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
							)}
						</PrimaryButton>
					</div>
				)}
				{!myPool && (pool.status === POOL_STATUS.COMING || pool.status === POOL_STATUS.LIVE) && (
					<Form onSubmit={bidAction} className={styles.form}>
						<Label
							label="Your Bid Amount"
							Component="label"
							after={
								<>
									Balance {parseFloat(balance).toFixed(2)} {pool.currency}
								</>
							}
						>
							<TextField
								name="bid"
								type="number"
								step={FLOAT}
								max={parseFloat(pool.limit) > 0 ? myLimit : undefined}
								after={
									<div className={styles.amount}>
										<FormSpy>
											{({ form }) => (
												<button
													className={styles.max}
													onClick={() => form.change("bid", parseFloat(balance))}
													type="button"
												>
													MAX
												</button>
											)}
										</FormSpy>
										<Currency token={pool.currency} />
									</div>
								}
								validate={parseFloat(pool.limit) > 0 && isNotGreaterThan(myLimit)}
							/>
						</Label>
						<PrimaryButton
							className={styles.cta}
							size="large"
							submit
							disabled={
								operation === OPERATION.loading ||
								pool.status === POOL_STATUS.COMING ||
								!isWhitelisted
							}
						>
							{operation === OPERATION.loading ? (
								<Spinner size="small" />
							) : isWhitelisted ? (
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
							) : (
								"You are not whitelisted"
							)}
						</PrimaryButton>
					</Form>
				)}
			</AuctionDetailView>
		);
	}

	return null;
};
