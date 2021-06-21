import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { FormProps } from "react-final-form";

import { OTC_TYPE } from "@app/api/otc/const";
import { View } from "@app/pages/otc-detail/View";
import { numToWei, weiToNum } from "@app/utils/bn/wei";
import { getMatchedOTCPool, MatchedOTCType } from "@app/utils/otc";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import { getBounceOtcContract, getOtcPools } from "@app/web3/api/bounce/otc";
import { creatorClaim, swapContracts, userClaim } from "@app/web3/api/bounce/pool";
import { useTokenQuery } from "@app/web3/api/tokens";
import {
	useAccount,
	useChainId,
	useConnected,
	useWeb3,
	useWeb3Provider,
} from "@app/web3/hooks/use-web3";

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

const MATCHED_TYPE = {
	0: OTC_TYPE.sell,
	1: OTC_TYPE.buy,
};

export const OTCDetail: FC<{ poolID: number; otcType: OTC_TYPE }> = ({ poolID, otcType }) => {
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
	const [userClaimed, setUserClaimed] = useState<boolean>(false);
	const [creatorClaimed, setCreatorClaimed] = useState<boolean>(false);

	const [limited, setLimited] = useState<boolean>(undefined);
	const [limit, setLimit] = useState<number>(undefined);

	const [isCreator, setCreator] = useState<boolean>(false);
	const [balance, setBalance] = useState<string | undefined>("");

	const [to, setTo] = useState(undefined);

	const [isETH, setETH] = useState(undefined);

	useEffect(() => {
		if (to && to.address === "0x0000000000000000000000000000000000000000") {
			setETH(true);
		}
	}, [to]);

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

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

		const pool = await getOtcPools(contract, poolID);

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);

		const matchedPool = await getMatchedOTCPool(contract, from, to, pool, poolID);

		setPool(matchedPool);
		setType(MATCHED_TYPE[pool.poolType]);
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
			const value = numToWei(values.bid, to.decimals, 0);

			try {
				setOperation(OPERATION.loading);
				await swapContracts(contract, value, account, poolID, isETH ? "0" : value);
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

	const { back: goBack } = useRouter();

	if (pool) {
		return (
			<>
				<View
					status={pool.status}
					id={poolID}
					name={pool.name}
					address={pool.address}
					type={type}
					currency={pool.currency}
					token={pool.token}
					price={pool.price}
					fill={pool.fill}
					actionTitle={""}
					amount={pool.amount}
					total={pool.total}
					openAt={+pool.openAt}
					onZero={onRequestData}
					onBack={() => goBack()}
				>
					<div />
				</View>
			</>
		);
	}

	return null;
};
