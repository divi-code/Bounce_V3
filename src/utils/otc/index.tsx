import { TokenInfo } from "@uniswap/token-lists";
import { Contract as ContractType } from "web3-eth-contract";

import { OTC_TYPE } from "@app/api/otc/const";
import { divide, isGreaterThanOrEqualTo, roundedDivide } from "@app/utils/bn";
import { fromWei, weiToNum } from "@app/utils/bn/wei";
import { getSwap1Amount, OtcPoolType } from "@app/web3/api/bounce/otc";
import { OTCPoolInfoType } from "@app/web3/api/bounce/otc-search";

export enum POOL_STATUS {
	COMING = "coming",
	LIVE = "live",
	CLOSED = "closed",
	FILLED = "filled",
	ERROR = "error",
}

export const getStatus = (openAt: string | number, amount: string, total: string): POOL_STATUS => {
	const nowTime = new Date();
	const openTime = new Date(+openAt);

	const isFilled = amount && total && isGreaterThanOrEqualTo(amount, total);

	const isOpen = nowTime > openTime;

	if (!isOpen) {
		return POOL_STATUS.COMING;
	}

	if (isOpen && !isFilled) {
		return POOL_STATUS.LIVE;
	}

	if (isOpen && isFilled) {
		return POOL_STATUS.FILLED;
	}
};

export const getProgress = (amount: string, total: string, decimals: number): number => {
	const convertedAmount = +fromWei(amount, decimals);
	const convertedTotal = +fromWei(total, decimals);

	return +roundedDivide(convertedAmount, convertedTotal, 2) * 100;
};

export const getSwapRatio = (
	fromAmount: string,
	toAmount: string,
	fromDecimals: number,
	toDecimals: number
): string => {
	const from = +fromWei(fromAmount, fromDecimals);
	const to = +fromWei(toAmount, toDecimals);

	return divide(from, to, 6);
};

export type MatchedOTCType = {
	status: POOL_STATUS;
	id: number;
	name: string;
	address: string;
	type: string;
	token: string;
	total: number;
	amount: number;
	currency: string;
	price: number;
	fill: number;
	openAt: number;
	whitelist: boolean;
};

const MATCHED_TYPE = {
	0: OTC_TYPE.sell,
	1: OTC_TYPE.buy,
};

export const getMatchedOTCPool = async (
	contract: ContractType,
	from: TokenInfo,
	to: TokenInfo,
	pool: Omit<OtcPoolType, "onlyBot">,
	id: number
): Promise<MatchedOTCType> => {
	const toAmount = await getSwap1Amount(contract, id);

	const fromTotal = pool.amountTotal0;
	const toTotal = pool.amountTotal1;

	const openAt = pool.openAt * 1000;

	return {
		status: getStatus(openAt, toAmount, toTotal),
		id: id,
		name: `${pool.name} OTC`,
		address: from.address,
		type: MATCHED_TYPE[pool.poolType],
		token: from.address,
		total: parseFloat(fromWei(toTotal, to.decimals).toFixed(6, 1)),
		amount: toAmount ? parseFloat(fromWei(toAmount, to.decimals).toFixed(6, 1)) : 0,
		currency: to.address,
		price: parseFloat(getSwapRatio(toTotal, fromTotal, to.decimals, from.decimals)),
		fill: getProgress(toAmount, toTotal, to.decimals),
		openAt: openAt,
		whitelist: pool.enableWhiteList,
	};
};
