import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { FormSpy, FormProps } from "react-final-form";

import {
	POOL_ADDRESS_MAPPING,
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { TextField } from "@app/modules/text-field";
import { DisplayPoolInfoType } from "@app/pages/auction";
import { AuctionDetailView } from "@app/pages/auction-detail/AuctionDetailView";
import { getAlertForOwner } from "@app/pages/auction-detail/getAlerts";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { PrimaryButton } from "@app/ui/button";
import { DescriptionList } from "@app/ui/description-list";
import { numToWei, weiToNum } from "@app/utils/bn/wei";
import { getProgress, getStatus, getSwapRatio } from "@app/utils/pool";
import {
	getBalance,
	getBounceContract,
	getEthBalance,
	getMyAmount,
	getPools,
	getTokenContract,
	swapContracts,
} from "@app/web3/api/bounce/contract";
import { useTokenQuery } from "@app/web3/api/tokens";
import {
	useAccount,
	useChainId,
	useConnected,
	useWeb3Provider,
	useWeb3,
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
	const [bid, setBid] = useState<string>();

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
		const bid = await getMyAmount(contract, account, poolID);

		console.log(pool);

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);

		const fromTotal = pool.amountTotal0;
		const toTotal = pool.amountTotal1;

		const fromAmount = pool.amountSwap0;
		const toAmount = pool.amountSwap1;

		const matchedPool = {
			status: getStatus(pool.openAt, pool.closeAt, fromAmount, fromTotal),
			id: poolID,
			name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
			address: from.address,
			type: POOL_SHORT_NAME_MAPPING[auctionType],
			token: from.symbol,
			total: weiToNum(fromTotal, from.decimals, 0),
			amount: fromAmount ? weiToNum(fromAmount, from.decimals, 6) : "0",
			currency: to.symbol,
			price: getSwapRatio(fromTotal, toTotal, from.decimals, to.decimals),
			fill: fromAmount ? getProgress(fromAmount, fromTotal) : 0,
			openAt: pool.openAt,
			closeAt: pool.closeAt,
			creator: pool.creator,
			claimAt: pool.claimAt > pool.closeAt ? pool.claimAt : undefined,
			limit: pool.limit ? weiToNum(pool.limit, from.decimals, 0) : undefined,
		};
		setPool(matchedPool);
		setBid(bid);
		setTo(to);

		if (pool.creator === account) {
			setMyPool(true);
		}

		//set alerts

		if (pool.creator === account) {
			setAlert(getAlertForOwner(pool.openAt, pool.closeAt, pool.amountSwap0, pool.amountTotal0));
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
			if (parseFloat(bid) > 0) {
				return "You Joined";
			} else return "Join The Pool";
		} else return "My Pool";
	};

	const [operation, setOperation] = useState(OPERATION.default);
	const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

	const bidAction: FormProps["onSubmit"] = async (values, form) => {
		console.log("value", values.bid);
		console.log("converted value", numToWei(values.bid, to.decimals, 0));

		const operation = async () => {
			try {
				setOperation(OPERATION.loading);
				await swapContracts(contract, numToWei(values.bid, to.decimals, 0), account, poolID);
				setOperation(OPERATION.completed);
				await updateData();
				form.change("amount", undefined);
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

	console.log(operation);

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
				limit={pool.limit ? pool.limit : undefined}
				alert={alert && <Alert title={alert.title} text={alert.text} type={alert.type} />}
			>
				{myPool ? (
					<DescriptionList
						data={{
							"Bid swap ratio": (
								<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
									1{"\u00a0"}
									<Currency token={pool.token} small />
									{"\u00a0"}={"\u00a0"}
									{pool.price}
									{"\u00a0"}
									<Currency token={pool.currency} small />
								</span>
							),
							"Total bid amount": (
								<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
									{pool.amount}
									{"\u00a0"}
									<Currency token={pool.currency} small />
								</span>
							),
						}}
					/>
				) : (
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
							/>
						</Label>
						<PrimaryButton size="large" submit>
							Place a Bid
						</PrimaryButton>
					</Form>
				)}
			</AuctionDetailView>
		);
	}

	return null;
};
