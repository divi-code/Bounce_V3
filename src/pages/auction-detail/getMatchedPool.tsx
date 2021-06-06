import { POOL_SHORT_NAME_MAPPING, POOL_SPECIFIC_NAME_MAPPING } from "@app/api/pool/const";
import { weiToNum } from "@app/utils/bn/wei";
import { getProgress, getStatus, getSwapRatio } from "@app/utils/pool";
import { getLimitAmount, getSwap1Amount } from "@app/web3/api/bounce/contract";

export const getMatchedPool = async (contract, from, to, pool, id, auctionType) => {
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
		total: weiToNum(toTotal, to.decimals, 6),
		amount: toAmount ? weiToNum(toAmount, to.decimals, 6) : "0",
		currency: to.symbol,
		price: getSwapRatio(toTotal, fromTotal, to.decimals, from.decimals),
		fill: getProgress(toAmount, toTotal, to.decimals),
		openAt: openAt,
		closeAt: closeAt,
		creator: pool.creator,
		claimAt: claimAt > closeAt ? claimAt : undefined,
		limit: weiToNum(limit, to.decimals, 6),
		whitelist: pool.enableWhiteList,
	};
};
