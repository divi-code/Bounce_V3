import { postJson } from "@app/api/network/json";
import { getAPIByNetwork } from "@app/api/pool/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

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

export enum METHODS {
	all = "query_all_pools",
	fixed = "query_fixed_pools",
	sealed_bid = "query_sealed_bid_pools",
	english = "query_english_pools",
	dutch = "query_dutch_auction_pools",
	lottery = "query_lottery_pools",
}

export const fetchPoolSearch = async (
	chainId: WEB3_NETWORKS,
	method: METHODS,
	params
): Promise<number[]> => {
	const res = await fetchInformation<{ pool_ids: number[] }>(chainId, {
		...params,
		method: method,
	});

	if (res.code !== 200) {
		console.error(res);
		throw new Error("failed to load data:" + res.error_msg);
	}

	return res.data.pool_ids || [];
};
