import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { fetchPoolSearch } from "@app/api/pool/api";
import {
	POOL_ADDRESS_MAPPING,
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
} from "@app/api/pool/const";

import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { DisplayPoolInfoType } from "@app/pages/auction/ui/card";
import { weiToNum } from "@app/utils/bn/wei";
import { getStatus, getSwapRatio, getProgress } from "@app/utils/pool";
import { getBounceContract, getSwap1Amount } from "@app/web3/api/bounce/contract";
import { PoolInfoType, queryPoolInformation } from "@app/web3/api/bounce/pool-search";
import { useTokenQuery } from "@app/web3/api/tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import { AuctionView } from "./AuctionView";

const WINDOW_SIZE = 9;

const tryParseJSON = (tryThis: string, orThis: any): any => {
	try {
		return JSON.parse(tryThis);
	} catch (e) {
		return orThis;
	}
};

const EMPTY_ARRAY = [];

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

	const [page, setPage] = useState(0);

	useEffect(() => {
		setSearchWindow(poolList.slice(page * WINDOW_SIZE, (page + 1) * WINDOW_SIZE));
	}, [page, poolList]);

	useEffect(() => {
		const { auctionType } = searchFilters;

		(async () => {
			if (searchWindow.length === 0) {
				setPoolInformation([]);

				return;
			}

			const pools = await queryPoolInformation(
				provider,
				POOL_ADDRESS_MAPPING[auctionType],
				chainId,
				searchWindow
			);
			setPoolInformation(pools.filter(Boolean));

			console.log("pools", pools);
		})();
	}, [chainId, searchWindow, provider, searchFilters]);

	const queryToken = useTokenQuery();

	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>(
		[]
	);

	useEffect(() => {
		const { auctionType } = searchFilters;

		if (poolInformation.length > 0) {
			Promise.all(
				poolInformation.map(async (pool) => {
					const from = await queryToken(pool.token0);
					const to = await queryToken(pool.token1);

					const contract = getBounceContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId);

					const toAmount = await getSwap1Amount(contract, pool.poolID);

					const fromTotal = pool.amountTotal0;
					const toTotal = pool.amountTotal1;

					const openAt = pool.openAt * 1000;
					const closeAt = pool.closeAt * 1000;

					return {
						href: `/auction/${auctionType}/${pool.poolID}`,
						status: getStatus(openAt, closeAt, toAmount, toTotal),
						id: pool.poolID,
						name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
						address: from.address,
						type: POOL_SHORT_NAME_MAPPING[auctionType],
						token: from.symbol,
						total: weiToNum(toTotal, to.decimals, 6),
						currency: to.symbol,
						price: getSwapRatio(toTotal, fromTotal, to.decimals, from.decimals),
						fill: toAmount ? getProgress(toAmount, toTotal, to.decimals) : 0,
					};
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [
		chainId,
		poolInformation,
		queryToken,
		searchFilters,
		searchFilters.auctionType,
		setConvertedPoolInformation,
	]);

	const router = useRouter();

	useEffect(
		() => {
			const { auctionType, ...rest } = searchFilters;

			if (auctionType) {
				const isEmpty = Object.keys(rest).length === 0;

				const filters = isEmpty ? "" : `?filters=${encodeURIComponent(JSON.stringify(rest))}`;

				router.push(`/auction/${auctionType}/${filters}`, undefined, {
					shallow: true,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchFilters]
	);

	const [initialSearchState] = useState(() => {
		try {
			return {
				...tryParseJSON(decodeURIComponent(router.query.filters as string), {}),
				auctionType: router.query.auctionType,
			};
		} catch (e) {
			console.error(e);

			return {};
		}
	});

	useEffect(
		() => {
			if (initialSearchState.auctionType && provider) {
				onSubmit(initialSearchState);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[provider]
	);

	return (
		<AuctionView
			onSubmit={onSubmit}
			result={poolInformation.length ? convertedPoolInformation : undefined}
			initialSearchState={initialSearchState}
			currentPage={page}
			numberOfPages={Math.floor(poolList.length / WINDOW_SIZE)}
			onBack={() => setPage(page - 1)}
			onNext={() => setPage(page + 1)}
		/>
	);
};
