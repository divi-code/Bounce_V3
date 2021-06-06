import { TokenInfo } from "@uniswap/token-lists";
import { Contract as ContractType } from "web3-eth-contract";

import {
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";
import { divide, isGreaterThanOrEqualTo } from "@app/utils/bn";
import { weiToNum } from "@app/utils/bn/wei";
import { AuctionPoolType, getLimitAmount, getSwap1Amount } from "@app/web3/api/bounce/contract";

export enum POOL_STATUS {
	COMING = "coming",
	LIVE = "live",
	CLOSED = "closed",
	FILLED = "filled",
	ERROR = "error",
}

export const getStatus = (
	openAt: string | number,
	closeAt: string | number,
	amount: string,
	total: string
): POOL_STATUS => {
	const nowTime = new Date();
	const openTime = new Date(+openAt);
	const closeTime = new Date(+closeAt);

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);

	const isOpen = nowTime > openTime;

	const isClose = nowTime > closeTime;

	if (!isOpen) {
		return POOL_STATUS.COMING;
	}

	if (isOpen && !isClose && !isFilled) {
		return POOL_STATUS.LIVE;
	}

	if (isOpen && !isClose && isFilled) {
		return POOL_STATUS.FILLED;
	}

	if (isClose && !isFilled) {
		return POOL_STATUS.CLOSED;
	}

	if (isClose && isFilled) {
		return POOL_STATUS.FILLED;
	}
};

export const getProgress = (amount: string, total: string, decimals: number): number => {
	const convertedAmount = weiToNum(amount, decimals);
	const convertedTotal = weiToNum(total, decimals);

	return parseFloat(divide(convertedAmount, convertedTotal, 2)) * 100;
};

export const getSwapRatio = (
	fromAmount: string,
	toAmount: string,
	fromDecimals: number,
	toDecimals: number
): string => {
	const from = weiToNum(fromAmount, fromDecimals, 6);
	const to = weiToNum(toAmount, toDecimals, 6);

	return divide(from, to, 6);
};

export type MatchedPoolType = {
	status: POOL_STATUS;
	id: number;
	name: string;
	address: string;
	type: POOL_TYPE;
	token: string;
	total: number;
	amount: number;
	currency: string;
	price: number;
	fill: number;
	openAt: number;
	closeAt: number;
	creator: string;
	claimAt: number;
	limit: number;
	whitelist: boolean;
};

export const getMatchedPool = async (
	contract: ContractType,
	from: TokenInfo,
	to: TokenInfo,
	pool: Omit<AuctionPoolType, "maxAmount1PerWallet" | "onlyBot">,
	id: number,
	auctionType: POOL_TYPE
): Promise<MatchedPoolType> => {
	const toAmount = await getSwap1Amount(contract, id);
	const limit = await getLimitAmount(contract, id);

	const fromTotal = pool.amountTotal0;
	const toTotal = pool.amountTotal1;

	const openAt = pool.openAt * 1000;
	const closeAt = pool.closeAt * 1000;
	const claimAt = pool.claimAt * 1000;

	return {
		status: getStatus(openAt, closeAt, toAmount, toTotal),
		id: id,
		name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
		address: from.address,
		type: POOL_SHORT_NAME_MAPPING[auctionType],
		token: from.symbol,
		total: parseFloat(weiToNum(toTotal, to.decimals, 6)),
		amount: toAmount ? parseFloat(weiToNum(toAmount, to.decimals, 6)) : 0,
		currency: to.symbol,
		price: parseFloat(getSwapRatio(toTotal, fromTotal, to.decimals, from.decimals)),
		fill: getProgress(toAmount, toTotal, to.decimals),
		openAt: openAt,
		closeAt: closeAt,
		creator: pool.creator,
		claimAt: claimAt > closeAt ? claimAt : closeAt,
		limit: parseFloat(weiToNum(limit, to.decimals, 6)),
		whitelist: pool.enableWhiteList,
	};
};
