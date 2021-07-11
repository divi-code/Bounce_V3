import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";

import { OTC_TYPE } from "@app/api/otc/const";
import { OTC_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { CreateFlowForOtc } from "@app/modules/create-flow-for-otc";
import { defineFlow } from "@app/modules/flow/definition";

import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { isLessThan } from "@app/utils/bn";
import { numToWei } from "@app/utils/bn/wei";
import { getTokenContract } from "@app/web3/api/bounce/erc";
import {
	approveOtcPool,
	createOtcPool,
	getBounceOtcContract,
	getOtcAllowance,
} from "@app/web3/api/bounce/otc";

import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./CreateOTC.module.scss";
import { Buying } from "./ui/buying";
import { Confirmation, BuyingConfirmationType } from "./ui/confirmation";
import { Settings } from "./ui/settings";
import { Token } from "./ui/token";

const BUYING_STEPS = defineFlow(Token, Buying, Settings, Confirmation);

enum OPERATION {
	default = "default",
	approval = "approval",
	confirm = "confirm",
	pending = "pending",
	success = "success",
	error = "error",
	cancel = "cancel",
}

const TITLE = {
	[OPERATION.approval]: "Bounce requests wallet approval",
	[OPERATION.confirm]: "Bounce requests wallet interaction",
	[OPERATION.pending]: "Bounce waiting for transaction settlement",
	[OPERATION.success]: "Auction successfully published",
	[OPERATION.error]: "Transaction failed on Bounce",
	[OPERATION.cancel]: "Transaction canceled on Bounce",
};

const CONTENT = {
	[OPERATION.approval]: "Please manually interact with your wallet",
	[OPERATION.confirm]:
		"Please open your wallet and confirm in the transaction activity to proceed your order",
	[OPERATION.pending]:
		"Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement",
	[OPERATION.success]:
		"Congratulations! Your auction is live and is now listed in designated area. Please find more information about the next steps in the pool page",
	[OPERATION.error]:
		"Oops! Your transaction is failed for on-chain approval and settlement. Please initiate another transaction",
	[OPERATION.cancel]: "Sorry! Your transaction is canceled. Please try again.",
};

export const CreateBuyingOTC: FC<MaybeWithClassName> = () => {
	const type = OTC_TYPE.buy;
	const provider = useWeb3Provider();
	const { account, chainId } = useWeb3React();

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

	const findToken = useTokenSearch();
	const { push: routerPush } = useRouter();

	const [poolId, setPoolId] = useState(undefined);

	const [operation, setOperation] = useState(OPERATION.default);

	const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

	const onComplete = async (data: BuyingConfirmationType) => {
		const operation = async () => {
			setOperation(OPERATION.approval);

			const tokenFrom = findToken(data.tokenFrom);
			const tokenTo = findToken(data.tokenTo);

			const fromAmount = numToWei(data.amount, tokenFrom.decimals, 0);
			const toAmount = numToWei(
				new BigNumber(data.amount).multipliedBy(new BigNumber(data.unitPrice)).toNumber(),
				tokenTo.decimals,
				0
			);

			try {
				const tokenContract = getTokenContract(provider, tokenTo.address);

				const allowance = await getOtcAllowance(tokenContract, chainId, account);

				if (isLessThan(allowance, toAmount)) {
					const result = await approveOtcPool(tokenContract, chainId, account, toAmount);

					if (!result.status) {
						setOperation(OPERATION.error);

						return;
					}
				}

				setOperation(OPERATION.confirm);

				await createOtcPool(
					contract,
					account,
					{
						name: data.poolName,
						token0: tokenTo.address,
						token1: tokenFrom.address,
						amountTotal0: toAmount,
						amountTotal1: fromAmount,
						openAt: +data.startPool / 1000,
						enableWhiteList: data.whitelist,
						onlyBot: false,
						poolType: 1,
						creator: account,
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
						setLastOperation(null);
						setPoolId(r.events.Created.returnValues[0]);
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

	return (
		<>
			<div className={styles.component}>
				<CreateFlowForOtc type={type} steps={BUYING_STEPS} onComplete={onComplete} />
			</div>
			{popUp.defined ? (
				<ProcessingPopUp
					title={TITLE[operation]}
					text={CONTENT[operation]}
					onSuccess={() => {
						routerPush(`${OTC_PATH}/${type}/${poolId}`);
						setOperation(OPERATION.default);
						close();
					}}
					onTry={tryAgainAction}
					isSuccess={operation === OPERATION.success}
					isLoading={
						operation === OPERATION.approval ||
						operation === OPERATION.pending ||
						operation === OPERATION.confirm
					}
					isError={operation === OPERATION.error || operation === OPERATION.cancel}
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
