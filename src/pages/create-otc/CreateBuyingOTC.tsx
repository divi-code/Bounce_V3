import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";

import { OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateFlowForOtc } from "@app/modules/create-flow-for-otc";
import { defineFlow } from "@app/modules/flow/definition";

import { Alert, ALERT_TYPE } from "@app/ui/alert";
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

export const CreateBuyingOTC: FC<MaybeWithClassName> = () => {
	const type = OTC_TYPE.buy;
	const provider = useWeb3Provider();
	const { account, chainId } = useWeb3React();

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

	const findToken = useTokenSearch();
	const { push: routerPush } = useRouter();

	const [operation, setOperation] = useState(OPERATION.default);

	const onComplete = async (data: BuyingConfirmationType) => {
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

			console.log("allowance", allowance);

			if (isLessThan(allowance, toAmount)) {
				const result = await approveOtcPool(tokenContract, chainId, account, toAmount);

				if (!result.status) {
					setOperation(OPERATION.error);

					return;
				}

				console.log("result", result);
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
					routerPush(`/otc/${type}/${poolId}`);
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
			<CreateFlowForOtc
				type={type}
				steps={BUYING_STEPS}
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
