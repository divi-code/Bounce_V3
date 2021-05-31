import { FC, useEffect, useState } from "react";

import {
	POOL_ADDRESS_MAPPING,
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";
import { DisplayPoolInfoType } from "@app/pages/auction";
import { AuctionDetailView } from "@app/pages/auction-detail/AuctionDetailView";
import { weiToNum } from "@app/utils/bn/wei";
import { getStatus, getSwapRatio, getProgress } from "@app/utils/pool";
import { getBounceContract, getPools } from "@app/web3/api/bounce/contract";
import { useTokenQuery } from "@app/web3/api/tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

export const AuctionDetail: FC<{ poolID: number; auctionType: POOL_TYPE }> = ({
	poolID,
	auctionType,
}) => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const queryToken = useTokenQuery();

	const [poolInformation, setPoolInformation] = useState<
		DisplayPoolInfoType & { amount: string }
	>();

	const contract = getBounceContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId);

	useEffect(() => {
		(async () => {
			const pool = await getPools(contract, poolID);

			const from = await queryToken(pool.token0);
			const to = await queryToken(pool.token1);

			const fromTotal = pool.amountTotal0;
			const toTotal = pool.amountTotal1;

			const fromAmount = pool.amountSwap0;
			const toAmount = pool.amountSwap1;

			const matchedPool = {
				status: getStatus(pool.openAt, pool.closeAt, fromAmount, fromTotal),
				id: poolID,
				name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
				address: from.address,
				type: POOL_SHORT_NAME_MAPPING[auctionType],
				token: from.symbol,
				total: weiToNum(fromTotal, from.decimals, 0),
				amount: fromAmount ? weiToNum(fromAmount, from.decimals, 0) : "0",
				currency: to.symbol,
				price: getSwapRatio(fromTotal, toTotal, from.decimals, to.decimals),
				fill: fromAmount ? getProgress(fromAmount, fromTotal) : 0,
			};

			setPoolInformation(matchedPool);
		})();
	}, [contract, poolID]);

	if (poolInformation) {
		return (
			<AuctionDetailView
				status={poolInformation.status}
				id={poolInformation.id}
				address={poolInformation.address}
				type={poolInformation.type}
				token={poolInformation.token}
				total={poolInformation.total}
				amount={poolInformation.amount}
				name={poolInformation.name}
				currency={poolInformation.currency}
				price={poolInformation.price}
				fill={poolInformation.fill}
			/>
		);
	}

	return null;
};
