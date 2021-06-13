import { AbstractProvider } from "web3-core";

import { callPoolDataByID } from "@app/web3/api/bounce/helpers";
import { getBouncePoolContract } from "@app/web3/api/bounce/pool";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

export const queryPoolInformation = async (
	provider: AbstractProvider,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS,
	queryListArr: number[]
) => {
	const contract = getBouncePoolContract(provider, target, chainId);

	return (
		await Promise.all(
			queryListArr.map(async (poolID) => {
				const poolItemInfo = await callPoolDataByID(contract, poolID);

				if (poolItemInfo && poolItemInfo.token0) {
					return { poolID, ...poolItemInfo };
				}

				return undefined;
			})
		)
	).filter(Boolean);
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type PoolInfoType = UnwrapPromise<ReturnType<typeof queryPoolInformation>>[number];
