import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";

import { POOL_ADDRESS_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateFlow } from "@app/modules/create-flow";
import { defineFlow } from "@app/modules/flow/definition";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { numToWei } from "@app/utils/bn/wei";
import {
	approveAuctionPool,
	createAuctionPool,
	getAllowance,
	getBounceContract,
	getTokenContract,
} from "@app/web3/api/bounce/contract";

import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./CreateAuction.module.scss";
import { Confirmation, ConfirmationInType } from "./ui/confirmation";
// import { Dutch } from "./ui/dutch";
// import { English } from "./ui/english";
import { Fixed } from "./ui/fixed";
// import { Lottery } from "./ui/lottery";
// import { SealedBid } from "./ui/sealed-bid";
import { Settings } from "./ui/settings";
import { Token } from "./ui/token";

const FIXED_STEPS = defineFlow(Token, Fixed, Settings, Confirmation);
// const SEALED_STEPS = defineFlow(Token, SealedBid, Settings, Confirmation);
// const DUTCH_STEPS = defineFlow(Token, Dutch, Settings, Confirmation);
// const ENGLISH_STEPS = defineFlow(Token, English, Settings, Confirmation);
// const LOTTERY_STEPS = defineFlow(Token, Lottery, Settings, Confirmation);

enum OPERATION {
	default = "default",
	approval = "approval",
	confirm = "confirm",
	pending = "confirm",
	success = "success",
	error = "error",
	cancel = "cancel",
}

const getAlertMessageByStatus = (status: OPERATION) => {
	switch (status) {
		case OPERATION.approval:
			return "Approving...";
		case OPERATION.pending:
			return "Transaction pending....";
		case OPERATION.error:
			return "Something went wrong";
		case OPERATION.cancel:
			return "Operation has been canceled";
		case OPERATION.success:
			return "Congratulations";
	}
};

const getAlertTypeByStatus = (status: OPERATION) => {
	switch (status) {
		case OPERATION.approval:
			return ALERT_TYPE.default;
		case OPERATION.pending:
			return ALERT_TYPE.default;
		case OPERATION.error:
			return ALERT_TYPE.error;
		case OPERATION.cancel:
			return ALERT_TYPE.error;
		case OPERATION.success:
			return ALERT_TYPE.success;
	}
};

const Effector: FC<{ onMount(): void }> = ({ onMount }) => {
	useEffect(onMount, []);

	return null;
};

export const CreateAuction: FC<MaybeWithClassName & { type: POOL_TYPE }> = ({ type }) => {
	const getStepsByType = (pool: POOL_TYPE) => {
		switch (pool) {
			case POOL_TYPE.fixed:
				return FIXED_STEPS;
			// case POOL_TYPE.sealed_bid:
			// 	return SEALED_STEPS;
			// case POOL_TYPE.english:
			// 	return DUTCH_STEPS;
			// case POOL_TYPE.dutch:
			// 	return ENGLISH_STEPS;
			// case POOL_TYPE.lottery:
			// 	return LOTTERY_STEPS;
		}
	};

	const provider = useWeb3Provider();
	const { account, chainId } = useWeb3React();

	const contract = useMemo(() => getBounceContract(provider, POOL_ADDRESS_MAPPING[type], chainId), [
		type,
		chainId,
		provider,
	]);

	const findToken = useTokenSearch();
	const { push: routerPush } = useRouter();

	const [operation, setOperation] = useState(OPERATION.default);

	const onComplete = async (data: ConfirmationInType) => {
		setOperation(OPERATION.approval);

		const tokenFrom = findToken(data.tokenFrom);
		const tokenTo = findToken(data.tokenTo);

		const fromAmount = numToWei(data.amount, tokenFrom.decimals, 0);
		const toAmount = numToWei(data.swapRatio * data.amount, tokenTo.decimals, 0);

		const limit = data.limit ? numToWei(data.limit, tokenTo.decimals, 0) : "0";

		try {
			const tokenContract = getTokenContract(provider, tokenFrom.address);

			const allowance = await getAllowance(
				tokenContract,
				POOL_ADDRESS_MAPPING[type],
				chainId,
				account
			);

			if (allowance < data.amount) {
				const result = await approveAuctionPool(
					tokenContract,
					POOL_ADDRESS_MAPPING[type],
					chainId,
					account,
					fromAmount
				);

				if (!result.status) {
					setOperation(OPERATION.error);

					return;
				}
			}

			setOperation(OPERATION.confirm);

			await createAuctionPool(
				contract,
				account,
				{
					name: data.poolName,
					creator: account,
					token0: tokenFrom.address,
					token1: tokenTo.address,
					amountTotal0: fromAmount,
					amountTotal1: toAmount,
					openAt: +data.startPool / 1000,
					closeAt: +data.endPool / 1000,
					claimAt: +data.claimStart / 1000,
					enableWhiteList: data.whitelist,
					maxAmount1PerWallet: limit,
					onlyBot: false,
				},
				data.whiteListList
			)
				.on("transactionHash", (h) => {
					console.log("hash", h);
					setOperation(OPERATION.pending);
				})
				.on("receipt", (r) => {
					console.log("receipt", r);
					setOperation(OPERATION.success);

					const poolId = r.events.Created.returnValues[0];
					routerPush(`/auction/${type}/${poolId}`);
				})
				.on("error", (e) => {
					console.error("error", e);
					setOperation(OPERATION.error);
				});
		} catch (e) {
			if (e.code === 4001) {
				setOperation(OPERATION.cancel);
			} else {
				setOperation(OPERATION.error);
			}

			console.log("err", e);
		} finally {
			// close modal
		}
	};

	return (
		<div className={styles.component}>
			<CreateFlow
				type={type}
				steps={getStepsByType(type)}
				onComplete={onComplete}
				alert={
					<>
						<Effector onMount={() => setOperation(OPERATION.default)} />
						{operation !== OPERATION.default && (
							<Alert
								title={getAlertMessageByStatus(operation)}
								type={getAlertTypeByStatus(operation)}
								style={{ marginBottom: 16 }}
							/>
						)}
					</>
				}
			/>
		</div>
	);
};
