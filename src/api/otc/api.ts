import { postJson } from "@app/api/network/json";
import { getAPIByNetwork } from "@app/api/pool/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { OTC_TYPE } from "./const";

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
	all: "query_all_otc",
	[OTC_TYPE.buy]: "query_buy",
	[OTC_TYPE.sell]: "query_sell",
};

export const fetchOTCPoolSearch = async (
	chainId: WEB3_NETWORKS,
	otcType: OTC_TYPE,
	params
): Promise<number[]> => {
	const res = await fetchInformation<{ pool_ids: number[] }>(chainId, {
		...params,
		method: METHODS_MAPPING[otcType],
	});

	if (res.code !== 200) {
		console.error(res);
		throw new Error("failed to load data:" + res.error_msg);
	}

	return res.data.pool_ids.filter(Boolean) || [];
};
