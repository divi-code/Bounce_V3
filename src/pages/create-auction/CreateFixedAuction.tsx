import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";

import { POOL_ADDRESS_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { AUCTION_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { CreateFlowForAuction } from "@app/modules/create-flow-for-auction";
import { defineFlow } from "@app/modules/flow/definition";

import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { isLessThan } from "@app/utils/bn";
import { numToWei } from "@app/utils/bn/wei";
import { getTokenContract } from "@app/web3/api/bounce/erc";
import {
	approveAuctionPool,
	createAuctionPool,
	getAllowance,
	getBouncePoolContract,
} from "@app/web3/api/bounce/pool";

import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./CreateAuction.module.scss";
import { Confirmation, ConfirmationInType } from "./ui/confirmation";
import { Fixed } from "./ui/fixed";
import { Settings } from "./ui/settings";
import { Token } from "./ui/token";

const FIXED_STEPS = defineFlow(Token, Fixed, Settings, Confirmation);

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

export const CreateFixedAuction: FC<MaybeWithClassName> = () => {
	const type = POOL_TYPE.fixed;
	const provider = useWeb3Provider();
	const { account, chainId } = useWeb3React();

	const contract = useMemo(
		() => getBouncePoolContract(provider, POOL_ADDRESS_MAPPING[type], chainId),
		[type, chainId, provider]
	);

	const findToken = useTokenSearch();
	const { push: routerPush } = useRouter();

	const [operation, setOperation] = useState(OPERATION.default);
	const [poolId, setPoolId] = useState(undefined);

	const [lastOperation, setLastOperation] = useState<(() => void) | null>(null);

	const onComplete = async (data: ConfirmationInType) => {
		const operation = async () => {
			setOperation(OPERATION.approval);

			const tokenFrom = findToken(data.tokenFrom);
			const tokenTo = findToken(data.tokenTo);

			const fromAmount = numToWei(data.amount, tokenFrom.decimals, 0);

			const toAmount = numToWei(
				+new BigNumber(data.amount).multipliedBy(new BigNumber(data.swapRatio)),
				tokenTo.decimals,
				0
			);

			const limit = data.limit ? numToWei(data.limit, tokenTo.decimals, 0) : "0";

			try {
				const tokenContract = getTokenContract(provider, tokenFrom.address);

				const allowance = await getAllowance(
					tokenContract,
					POOL_ADDRESS_MAPPING[type],
					chainId,
					account
				);

				if (isLessThan(allowance, fromAmount)) {
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
						setPoolId(r.events.Created.returnValues[0]);
						setLastOperation(null);
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
				<CreateFlowForAuction type={type} steps={FIXED_STEPS} onComplete={onComplete} />
			</div>
			{popUp.defined ? (
				<ProcessingPopUp
					title={TITLE[operation]}
					text={CONTENT[operation]}
					onSuccess={() => {
						routerPush(`${AUCTION_PATH}/${type}/${poolId}`);
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
