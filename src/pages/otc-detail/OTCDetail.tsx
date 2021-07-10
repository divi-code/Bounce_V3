import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { FormProps } from "react-final-form";

import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { Timer } from "@app/modules/timer";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { Caption } from "@app/ui/typography";
import { isGreaterThan, isLessThan } from "@app/utils/bn";
import { fromWei, numToWei, weiToNum } from "@app/utils/bn/wei";
import { getMatchedOTCPool, MatchedOTCType, POOL_STATUS } from "@app/utils/otc";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import {
	approveOtcPool,
	getBounceOtcContract,
	getOtcAllowance,
	getOtcPools,
	getWhitelistedStatus,
	swapContracts,
	getMyAmount0,
} from "@app/web3/api/bounce/otc";
import { isEth } from "@app/web3/api/eth/use-eth";
import { useTokenQuery } from "@app/web3/api/tokens";
import {
	useAccount,
	useChainId,
	useConnected,
	useWeb3,
	useWeb3Provider,
} from "@app/web3/hooks/use-web3";

import { Claim } from "./Claim";
import styles from "./OTCDetail.module.scss";
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

const MATCHED_TYPE = {
	0: OTC_TYPE.sell,
	1: OTC_TYPE.buy,
};

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

export const OTCDetail: FC<{ poolID: number; otcType: OTC_TYPE }> = ({ poolID }) => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const queryToken = useTokenQuery();
	const isConnected = useConnected();
	const account = useAccount();
	const web3 = useWeb3();

	const [pool, setPool] = useState<MatchedOTCType>();
	const [type, setType] = useState<OTC_TYPE>();

	const [userWhitelisted, setUserWhitelisted] = useState<boolean>(false);
	const [userPlaced, setUserPlaced] = useState<boolean>(false);

	const [isCreator, setCreator] = useState<boolean>(false);
	const [balance, setBalance] = useState<string | undefined>("");

	const [to, setTo] = useState(undefined);

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

	const updateData = useCallback(async () => {
		if (!contract) {
			return;
		}

		//get pool info

		const pool = await getOtcPools(contract, poolID);

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);

		const whitelistStatus = await getWhitelistedStatus(contract, poolID, account);

		const matchedPool = await getMatchedOTCPool(contract, from, to, pool, poolID);

		const userBid = await getMyAmount0(contract, account, poolID);

		setTo(to);
		setPool(matchedPool);
		setType(MATCHED_TYPE[pool.poolType]);

		setCreator(pool.creator === account);
		setUserWhitelisted(matchedPool.whitelist ? whitelistStatus : true);

		setUserPlaced(isGreaterThan(userBid, 0));

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
	}, [contract, poolID, queryToken]);

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

				if (!isEth(to?.address)) {
					const tokenContract = getTokenContract(provider, to.address);

					const allowance = await getOtcAllowance(tokenContract, chainId, account);

					if (isLessThan(allowance, value)) {
						const result = await approveOtcPool(tokenContract, chainId, account, value);

						if (!result.status) {
							setOperation(OPERATION.failed);

							return;
						}
					}
				}

				setOperation(OPERATION.confirmed);

				await swapContracts(contract, value, account, poolID, !isEth(to?.address) ? "0" : value)
					.on("transactionHash", (h) => {
						console.log("hash", h);
						setOperation(OPERATION.pending);
					})
					.on("receipt", (r) => {
						console.log("receipt", r);
						setOperation(OPERATION.placed);
						updateData();
						form.change("bid", undefined);
						setLastOperation(null);
					})
					.on("error", (e) => {
						console.error("error", e);
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

	//processing pop-up

	const { popUp, close, open } = useControlPopUp();

	useEffect(() => {
		if (operation !== OPERATION.default) {
			open();
		}
	}, [open, operation]);

	//set content

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
			setTitle("My OTC");
		} else if (userPlaced) {
			setTitle("You Joined");
		} else {
			setTitle("My offer");
		}
	}, [userPlaced, isCreator]);

	//set alerts

	const [alert, setAlert] = useState<AlertType | undefined>();

	useEffect(() => {
		if (pool) {
			if (isCreator) {
				setAlert(getAlertForOwner(pool.openAt, pool.amount, pool.total));
			} else {
				setAlert(
					getAlertForUsers(userWhitelisted, pool.openAt, pool.amount, pool.total, userPlaced)
				);
			}
		}
	}, [isCreator, pool, userPlaced, userWhitelisted]);

	const { back: goBack } = useRouter();

	if (pool) {
		return (
			<>
				<View
					status={pool.status}
					id={poolID}
					name={pool.name}
					address={pool.address}
					type={OTC_SHORT_NAME_MAPPING[type]}
					currency={pool.currency}
					token={pool.token}
					price={pool.price}
					fill={pool.fill}
					actionTitle={title}
					amount={pool.amount}
					total={pool.total}
					openAt={+pool.openAt}
					onZero={onRequestData}
					onBack={() => goBack()}
					alert={alert && <Alert title={alert.title} text={alert.text} type={alert.type} />}
				>
					{action === ACTION.claim && (
						<Claim
							token={pool.token}
							price={pool.price}
							currency={pool.currency}
							amount={pool.amount}
							isNonAction={!isCreator || (isCreator && pool.status !== POOL_STATUS.CLOSED)}
							disabled={operation === OPERATION.loading}
							loading={operation === OPERATION.loading}
							onClick={isCreator ? () => null : undefined}
						>
							Cancel OTC Offer
						</Claim>
					)}
					{action === ACTION.place && (
						<PlaceBid
							currency={pool.currency}
							balance={balance}
							disabled={
								operation === OPERATION.loading ||
								pool.status === POOL_STATUS.COMING ||
								!userWhitelisted
							}
							loading={operation === OPERATION.loading}
							onSubmit={bidAction}
						>
							<>
								{type === OTC_TYPE.buy && "Sell"}
								{type === OTC_TYPE.sell && "Buy"}{" "}
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
	}

	return null;
};
