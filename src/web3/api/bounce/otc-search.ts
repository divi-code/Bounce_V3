import { AbstractProvider } from "web3-core";

import { callOTCPoolDataByID } from "@app/web3/api/bounce/helpers";
import { getBounceOtcContract } from "@app/web3/api/bounce/otc";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

export const queryOTCPoolInformation = async (
	provider: AbstractProvider,
	chainId: WEB3_NETWORKS,
	queryListArr: number[]
) => {
	const contract = getBounceOtcContract(provider, chainId);

	return (
		await Promise.all(
			queryListArr.map(async (poolID) => {
				const poolItemInfo = await callOTCPoolDataByID(contract, poolID);

				if (poolItemInfo && poolItemInfo.token0) {
					return { poolID, ...poolItemInfo };
				}

				return undefined;
			})
		)
	).filter(Boolean);
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type OTCPoolInfoType = UnwrapPromise<ReturnType<typeof queryOTCPoolInformation>>[number];
