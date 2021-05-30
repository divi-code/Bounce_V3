import { postJson } from "@app/api/network/json";
import { getAPIByNetwork } from "@app/api/pool/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { POOL_TYPE } from "./const";

type APIResponse<T> = {
	code: 200 | 500;
	error_msg: string;
	data: T;
};

const fetchInformation = async <T = any>(
	chainId: WEB3_NETWORKS,
	params
): Promise<APIResponse<T>> => {
	const url = getAPIByNetwork(chainId);

	return postJson(undefined, url, params);
};

const METHODS_MAPPING = {
	all: "query_all_pools",
	[POOL_TYPE.fixed]: "query_fixed_pools",
	[POOL_TYPE.sealed_bid]: "query_sealed_bid_pools",
	[POOL_TYPE.english]: "query_english_pools",
	[POOL_TYPE.dutch]: "query_dutch_auction_pools",
	[POOL_TYPE.lottery]: "query_lottery_pools",
};

export const fetchPoolSearch = async (
	chainId: WEB3_NETWORKS,
	poolType: POOL_TYPE,
	params
): Promise<number[]> => {
	const res = await fetchInformation<{ pool_ids: number[] }>(chainId, {
		...params,
		method: METHODS_MAPPING[poolType],
	});

	if (res.code !== 200) {
		console.error(res);
		throw new Error("failed to load data:" + res.error_msg);
	}

	return res.data.pool_ids.filter(Boolean) || [];
};
