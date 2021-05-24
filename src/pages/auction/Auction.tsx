import { FORM_ERROR } from "final-form";
import { useEffect, useState } from "react";

import { fetchPoolSearch } from "@app/api/pool/api";
import { POOL_NAME_MAPPING } from "@app/api/pool/const";

import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { PoolInfoType, queryPoolInformation } from "@app/web3/api/bounce/pool-search";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";
import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

import { AuctionView } from "./AuctionView";

import { CardType } from "./ui/card";

const WINDOW_SIZE = 10;

export const Auction = () => {
	const provider = useWeb3Provider();
	const chainId = useChainId();

	const [poolList, setPoolList] = useState<number[]>([]);
	const walletControl = useConnectWalletControl();

	const [searchFilters, setSearchFilters] = useState<any>({});

	const onSubmit = async (values: any) => {
		if (!provider) {
			if (!(await walletControl.requestAuthorization())) {
				return {
					[FORM_ERROR]: "Please connect web3",
				};
			}
		}

		setSearchFilters(values);

		const { auctionType, ...params } = values;

		const pools = await fetchPoolSearch(chainId, auctionType, params);
		setPoolList(pools);
	};

	const [poolInformation, setPoolInformation] = useState<PoolInfoType[]>([]);

	const [searchWindow, setSearchWindow] = useState<number[]>([]);

	useEffect(() => {
		const page = 10;
		setSearchWindow(poolList.slice(page * WINDOW_SIZE, (page + 1) * WINDOW_SIZE));
	}, [poolList]);

	useEffect(() => {
		(async () => {
			if (searchWindow.length === 0) {
				setPoolInformation([]);

				return;
			}

			const pools = await queryPoolInformation(
				provider,
				ADDRESS_MAPPING.FIX_SWAP,
				chainId,
				searchWindow
			);
			setPoolInformation(pools);
			console.log(pools);
		})();
	}, [chainId, searchWindow, provider]);

	const convertedPoolInformation: CardType[] = poolInformation.map((pool) => {
		return {
			href: "",
			status: pool.status,
			time: pool.closeTime,
			id: pool.poolID,
			name: pool.poolName,
			address: pool.creator,
			type: POOL_NAME_MAPPING[searchFilters.auctionType],
			tokenCurrency: pool.fromToken.symbol,
			tokenSymbol: "",
			auctionAmount: pool.toBidAmount,
			auctionCurrency: pool.toToken.symbol,
			auctionPrice: pool.currentPrice,
			fillInPercentage: pool.progress,
		};
	});

	return (
		<AuctionView
			onSubmit={onSubmit}
			result={poolInformation.length ? convertedPoolInformation : undefined}
		/>
	);
};
