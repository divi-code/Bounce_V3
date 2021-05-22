import { AbstractProvider } from "web3-core";

import { divide } from "@app/utils/bn";
import { weiToNum } from "@app/utils/bn/wei";
import { getPoolStatus } from "@app/utils/pool";
import { getBounceContract } from "@app/web3/api/bounce/contract";
import { queryPoolItem } from "@app/web3/api/bounce/helpers";
import { queryERC20Token } from "@app/web3/api/eth/api";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

const keyMap = [
	{
		key: "creatorFP",
		name: "creator",
		needTrans: false,
	},
	{
		key: "nameFP",
		name: "name",
		needTrans: false,
	},
	{
		key: "token0FP",
		name: "fromAddress",
		needTrans: false,
	},
	{
		key: "token1FP",
		name: "toAddress",
		needTrans: false,
	},
	{
		key: "passwordFP",
		name: "password",
		needTrans: false,
	},
	{
		key: "amountTotal0FP",
		name: "fromAmount",
		needTrans: false,
	},
	{
		key: "amountSwap0FP",
		name: "fromBidAmount",
		needTrans: false,
	},
	{
		key: "amountTotal1FP",
		name: "toAmount",
		needTrans: true,
	},
	{
		key: "maxEthPerWalletFP",
		name: "maxEthPreWallet",
		needTrans: true,
	},
	{
		key: "amountSwap1FP",
		name: "toBidAmount",
		needTrans: true,
	},
	{
		key: "closeAtFP",
		name: "time",
	},
	{
		key: "onlyBotHolder",
		name: "onlyBot",
		needTrans: false,
	},
];

export const getProgress = (fromAmount, fromBidAmount) => +divide(fromBidAmount, fromAmount, 0);

export const getParticipant = (password: string, onlyBot: boolean) => {
	if (password !== "0") {
		return "private";
	}

	if (onlyBot === true) {
		return "BOT";
	}

	return "public";
};

export const getSwapRatio = (
	fromAmount: string,
	toAmount: string,
	fromDecimals: number,
	toDecimals: number
): string => {
	const token1 = weiToNum(fromAmount, fromDecimals);
	const token2 = weiToNum(toAmount, toDecimals);
	const ratio = divide(token1, token2, 4);

	return Number(ratio) ? ratio : "<0.0001";
};

export const queryPoolInformation = (
	provider: AbstractProvider,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS,
	queryListArr: number[]
) => {
	const contract = getBounceContract(provider, target, chainId);

	return Promise.all(
		queryListArr.map(async (poolID) => {
			const poolItemInfo = await queryPoolItem(contract, poolID, keyMap);

			const poolItemData = {
				poolID: poolID,
				status: getPoolStatus(poolItemInfo.time, poolItemInfo.toAmount, poolItemInfo.toBidAmount),
				progress: getProgress(poolItemInfo.fromAmount, poolItemInfo.fromBidAmount),
				poolName: poolItemInfo.name,
				fromToken: await queryERC20Token(provider, poolItemInfo.fromAddress, chainId),
				toToken: await queryERC20Token(provider, poolItemInfo.toAddress, chainId),
				Participant: getParticipant(poolItemInfo.password, poolItemInfo.onlyBot),
				creator: poolItemInfo.creator,
				swapRatio: "",
				currentPrice: 0,
				closeTime: poolItemInfo.time,
				toBidAmount: "",
			};

			poolItemData.toBidAmount = weiToNum(poolItemInfo.toBidAmount, poolItemData.toToken.decimals);

			poolItemData.swapRatio = getSwapRatio(
				poolItemInfo.fromAmount,
				poolItemInfo.toAmount,
				poolItemData.fromToken.decimals,
				poolItemData.toToken.decimals
			);

			poolItemData.currentPrice =
				poolItemData.swapRatio === "<0.0001" ? 0.0001 : parseFloat(poolItemData.swapRatio);

			return poolItemData;
		})
	);
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type PoolInfoType = UnwrapPromise<ReturnType<typeof queryPoolInformation>>[number];
