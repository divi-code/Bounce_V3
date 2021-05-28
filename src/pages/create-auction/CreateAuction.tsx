import { useWeb3React } from "@web3-react/core";
import { FC } from "react";

import { POOL_ADDRESS_MAPPING, POOL_NAME_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateFlow } from "@app/modules/create-flow";
import { defineFlow } from "@app/modules/flow/definition";

import { WHITELIST_TYPE } from "@app/modules/provide-advanced-settings";
import { numToWei } from "@app/utils/bn/wei";
import {
	approveAuctionPool,
	createAuctionPool,
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
	const contract = getBounceContract(provider, POOL_ADDRESS_MAPPING[type], chainId);

	const findToken = useTokenSearch();

	const onComplete = async (data: ConfirmationInType) => {
		try {
			const tokenContract = getTokenContract(provider, findToken(data.tokenFrom).address);

			const result = await approveAuctionPool(
				tokenContract,
				POOL_ADDRESS_MAPPING[type],
				chainId,
				account,
				numToWei(data.amount, findToken(data.tokenFrom).decimals, 0)
			);

			console.log(result);

			if (result.status) {
				const createAuctionResult = await createAuctionPool(contract, account, {
					name: data.poolName,
					creator: account,
					token0: findToken(data.tokenFrom).address,
					token1: findToken(data.tokenTo).address,
					amountTotal0: numToWei(data.amount, findToken(data.tokenFrom).decimals, 0),
					amountTotal1: numToWei(data.swapRatio * data.amount, findToken(data.tokenTo).decimals, 0),
					openAt: +data.startPool,
					closeAt: +data.endPool,
					claimAt: +data.claimStart,
					enableWhiteList: data.whitelist === WHITELIST_TYPE.yes,
					maxAmount1PerWallet:
						numToWei(-data.limit, findToken(data.tokenFrom).decimals, 0) ||
						numToWei(0, findToken(data.tokenFrom).decimals, 0),
					onlyBot: false,
				});
				console.log(createAuctionResult);
			} else {
				console.log("Approval Error");
			}
		} catch (e) {
			console.error(e);
			console.log("Error");
		} finally {
			// close modal
		}
	};

	return (
		<div className={styles.component}>
			<CreateFlow
				type={POOL_NAME_MAPPING[type]}
				steps={getStepsByType(type)}
				onComplete={onComplete}
			/>
		</div>
	);
};
