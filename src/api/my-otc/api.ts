import { getJson } from "@app/api/network/json";
import { OtcSearchEntity } from "@app/api/otc/types";
import { getAPIByNetwork } from "@app/api/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { OTC_TYPE } from "./const";

type APIResponse<T> = {
	code: 200 | 500;
	error_msg: string;
	data: T;
	total: number;
};

const fetchInformation = async <T = any>(
	chainId: WEB3_NETWORKS,
	url: string,
	params
): Promise<APIResponse<T>> => {
	const apiPrefix = getAPIByNetwork(chainId);

	return getJson(undefined, `${apiPrefix}/${url}`, params);
};

const toAuctionType = {
	created: 0,
	participated: 1,
};

export const fetchOtcSearch = async (
	chainId: WEB3_NETWORKS,
	address: string,
	poolType: "created" | "participated",
	pagination: {
		page: number;
		perPage: number;
	}
): Promise<{
	data: OtcSearchEntity[];
	meta: {
		total: number;
	};
}> => {
	const res = await fetchInformation<OtcSearchEntity[]>(chainId, "my/otcs", {
		address: address,
		offset: pagination.page * pagination.perPage,
		limit: pagination.perPage,
		action_type: toAuctionType[poolType] || 0,
	});

	if (!res.data) {
		console.error(res);
		throw new Error("failed to load data:" + res.error_msg);
	}

	return {
		data: res.data,
		meta: {
			total: res.total,
		},
	};
};
