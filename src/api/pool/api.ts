import { getJson } from "@app/api/network/json";
import { IPoolSearchEntity } from "@app/api/pool/types";
import { getAPIByNetwork } from "@app/api/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { POOL_TYPE } from "./const";

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
	[POOL_TYPE.all]: 0,
	[POOL_TYPE.fixed]: 1,
};

const mapToParams = <T extends string, K extends string>(
	data: Partial<Record<T, any>>,
	mapping: Record<T, K>
): Record<K, any> =>
	Object.keys(data).reduce((acc, key) => {
		const mapped = mapping[key];

		if (mapped) {
			acc[mapped] = data[key];
		}

		return acc;
	}, {} as any);

export const fetchPoolSearch = async (
	chainId: WEB3_NETWORKS,
	poolType: POOL_TYPE,
	filters: {
		token?: string;
		poolId?: string;
		poolName?: string;
		creator?: string;
	},
	pagination: {
		page: number;
		perPage: number;
	}
): Promise<{
	data: IPoolSearchEntity[];
	meta: {
		total: number;
	};
}> => {
	const res = await fetchInformation<IPoolSearchEntity[]>(chainId, "auctions", {
		offset: pagination.page * pagination.perPage,
		limit: pagination.perPage,
		auction_type: toAuctionType[poolType] || 0,
		...mapToParams(filters, {
			token: "token",
			creator: "creator",
			poolId: "pool_id",
			poolName: "pool_name",
		}),
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
