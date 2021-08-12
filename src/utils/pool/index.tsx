// import { TokenInfo } from "@uniswap/token-lists";
import { TokenInfo } from "@uniswap/token-lists";
import { Contract as ContractType } from "web3-eth-contract";

import {
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";
import { divide, isGreaterThanOrEqualTo, roundedDivide } from "@app/utils/bn";
import { fromWei } from "@app/utils/bn/wei";
import {
	AuctionPoolType,
	getLimitAmount,
	getSwap1Amount,
	getCreatorClaimed,
	getMyClaimed,
} from "@app/web3/api/bounce/pool";

export enum POOL_STATUS {
	COMING = "coming",
	LIVE = "live",
	CLOSED = "closed",
	FILLED = "filled",
	ERROR = "error",
}

const getStatus = (
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

	const isComing = nowTime < openTime;

	if (!isComing) {
		if (isOpen && !isClose) {
			if (isFilled) {
				return POOL_STATUS.FILLED;
			} else return POOL_STATUS.LIVE;
		} else return POOL_STATUS.CLOSED;
	} else return POOL_STATUS.COMING;
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

export type MatchedPoolType = {
	status: POOL_STATUS;
	id: number;
	name: string;
	// address: string;
	type: string;
	from: TokenInfo;
	to: TokenInfo;
	// token: string;
	total: number;
	amount: number;
	// currency: string;
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
	auctionType: POOL_TYPE,
	account
): Promise<MatchedPoolType> => {
	const toAmount = await getSwap1Amount(contract, id);
	const limit = await getLimitAmount(contract, id);

	const fromTotal = pool.amountTotal0;
	const toTotal = pool.amountTotal1;

	const openAt = pool.openAt * 1000;
	const closeAt = pool.closeAt * 1000;
	const claimAt = pool.claimAt * 1000;

	const creatorClaim = await getCreatorClaimed(contract, account, id);
	const userClaim = await getMyClaimed(contract, account, id);

	const isClaimed = creatorClaim || userClaim;

	return {
		status: isClaimed ? POOL_STATUS.CLOSED : getStatus(openAt, closeAt, toAmount, toTotal),
		id: id,
		name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
		from: from,
		to: to,
		type: POOL_SHORT_NAME_MAPPING[auctionType],
		total: parseFloat(fromWei(toTotal, to.decimals).toString()),
		amount: toAmount ? parseFloat(fromWei(toAmount, to.decimals).toString()) : 0,
		price: parseFloat(getSwapRatio(toTotal, fromTotal, to.decimals, from.decimals)),
		fill: getProgress(toAmount, toTotal, to.decimals),
		openAt: openAt,
		closeAt: closeAt,
		creator: pool.creator,
		claimAt: claimAt,
		limit: parseFloat(fromWei(limit, to.decimals).toString()),
		whitelist: pool.enableWhiteList,
	};
};
