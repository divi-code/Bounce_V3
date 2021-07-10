import { ActivitySearchEntity } from "@app/api/my-activity/types";
import { getJson } from "@app/api/network/json";
import { getAPIByNetwork } from "@app/api/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

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

export const fetchActivitiesSearch = async (
	chainId: WEB3_NETWORKS,
	address: string,
	pagination: {
		page: number;
		perPage: number;
	}
): Promise<{
	data: ActivitySearchEntity[];
	meta: {
		total: number;
	};
}> => {
	const res = await fetchInformation<ActivitySearchEntity[]>(chainId, "my/activities", {
		address: address,
		offset: pagination.page * pagination.perPage,
		limit: pagination.perPage,
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
