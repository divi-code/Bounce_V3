import { FC, useEffect, useState } from "react";

import { POOL_ADDRESS_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { getBounceContract, getPools } from "@app/web3/api/bounce/contract";
import { PoolInfoType } from "@app/web3/api/bounce/pool-search";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

export const AuctionView: FC<{ poolID: number; auctionType: POOL_TYPE }> = ({
	poolID,
	auctionType,
}) => {
	const provider = useWeb3Provider();
	const chainId = useChainId();

	const [poolInformation, setPoolInformation] = useState<PoolInfoType>({});

	const contract = getBounceContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId);

	useEffect(() => {
		(async () => {
			const pool = await getPools(contract, poolID);
			setPoolInformation(pool);
		})();
	}, [contract, poolID]);

	if (poolInformation) {
		return <div>{poolID}</div>;
	}

	return null;
};
