import { AbstractProvider } from "web3-core";

import { getBounceContract } from "@app/web3/api/bounce/contract";
import { callPoolDataByID } from "@app/web3/api/bounce/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

export const queryPoolInformation = (
	provider: AbstractProvider,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS,
	queryListArr: number[]
) => {
	const contract = getBounceContract(provider, target, chainId);

	return Promise.all(
		queryListArr.map(async (poolID) => {
			const poolItemInfo = await callPoolDataByID(contract, poolID);

			console.log(poolItemInfo);

			if (poolItemInfo && poolItemInfo.token0) {
				return { poolID, ...poolItemInfo };
			}

			return undefined;
		})
	);
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type PoolInfoType = UnwrapPromise<ReturnType<typeof queryPoolInformation>>[number];
