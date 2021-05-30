import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { fetchPoolSearch } from "@app/api/pool/api";
import { POOL_NAME_MAPPING } from "@app/api/pool/const";

import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { divide } from "@app/utils/bn";
import { weiToNum } from "@app/utils/bn/wei";
import { POOL_STATUS } from "@app/utils/pool";
import { PoolInfoType, queryPoolInformation } from "@app/web3/api/bounce/pool-search";
import { queryERC20Token } from "@app/web3/api/eth/api";
import { useTokenQuery, useTokenSearch } from "@app/web3/api/tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";
import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

import { AuctionView } from "./AuctionView";

const WINDOW_SIZE = 10;

const getProgress = (amount, totalAmount) => +divide(amount, totalAmount, 0);

const getSwapRatio = (
	fromAmount: string,
	toAmount: string,
	fromDecimals: number,
	toDecimals: number
): string => {
	const from = weiToNum(fromAmount, fromDecimals);
	const to = weiToNum(toAmount, toDecimals);

	return divide(from, to, 2);
};

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
		const page = 0;
		setSearchWindow(poolList.filter(Boolean).slice(page * WINDOW_SIZE, (page + 1) * WINDOW_SIZE));
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
			setPoolInformation(pools.filter(Boolean));
		})();
	}, [chainId, searchWindow, provider]);

	const findToken = useTokenSearch();
	const queryToken = useTokenQuery();

	const [convertedPoolInformation, setConvertedPoolInformation] = useState<PoolInfoType[]>([]);

	useEffect(() => {
		Promise.all(
			poolInformation.map(async (pool) => {
				const from = await queryToken(pool.token0);
				const to = await queryToken(pool.token1);

				return {
					href: "",
					status: POOL_STATUS.LIVE,
					time: pool.openAt,
					id: pool.poolID,
					name: pool.name,
					address: pool.token0,
					type: POOL_NAME_MAPPING[searchFilters.auctionType],
					tokenCurrency: from.symbol,
					tokenLogo: from.logoURI,
					auctionAmount: pool.amountTotal0,
					auctionCurrency: to.symbol,
					auctionPrice: getSwapRatio(
						pool.amountTotal0,
						pool.amountTotal1,
						from.decimals,
						to.decimals
					),
					fillInPercentage: pool.amountSwap0 ? getProgress(pool.amountSwap0, pool.amountTotal0) : 0,
				};
			})
		).then((info) => setConvertedPoolInformation(info));
	}, [
		chainId,
		findToken,
		poolInformation,
		provider,
		searchFilters.auctionType,
		setConvertedPoolInformation,
	]);

	const router = useRouter();

	useEffect(
		() => {
			const isEmpty = Object.keys(searchFilters).length === 0;

			if (!isEmpty) {
				router.push("/?filters=" + encodeURIComponent(JSON.stringify(searchFilters)), undefined, {
					shallow: true,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchFilters]
	);

	const [initialSearchState] = useState(() => {
		try {
			if (!router.query.filters) {
				return {};
			}

			return JSON.parse(decodeURIComponent(router.query.filters as string));
		} catch (e) {
			console.error(e);

			return {};
		}
	});

	useEffect(
		() => {
			const isEmpty = Object.keys(initialSearchState).length === 0;

			if (!isEmpty) {
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
		/>
	);
};
