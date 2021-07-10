import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { fetchOtcSearch } from "@app/api/otc/api";
import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { OtcSearchEntity } from "@app/api/otc/types";

import { OTC_PATH } from "@app/const/const";
import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { OTCView } from "@app/pages/otc/OTCView";
import { DisplayOTCInfoType } from "@app/pages/otc/ui/card";
import { fromWei } from "@app/utils/bn/wei";
import { getProgress, getStatus, getSwapRatio } from "@app/utils/pool";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

const WINDOW_SIZE = 9;

const tryParseJSON = (tryThis: string, orThis: any): any => {
	try {
		return JSON.parse(tryThis);
	} catch (e) {
		return orThis;
	}
};

const EMPTY_ARRAY = [];

type SearchFilters = any;

const useURLControl = (
	searchFilters: SearchFilters,
	provider: any,
	onSubmit: (state: any) => void
) => {
	const router = useRouter();

	// update URL
	useEffect(
		() => {
			const { auctionType, ...rest } = searchFilters;

			if (auctionType) {
				const isEmpty = Object.keys(rest).length === 0;

				const filters = isEmpty ? "" : `?filters=${encodeURIComponent(JSON.stringify(rest))}`;

				router.push(`/${OTC_PATH}/${auctionType}/${filters}`, undefined, {
					shallow: true,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchFilters]
	);

	// initial form state
	const [initialSearchState] = useState(() => {
		try {
			return {
				...tryParseJSON(decodeURIComponent(router.query.filters as string), {}),
				auctionType: router.query.otcType,
			};
		} catch (e) {
			console.error(e);

			return {};
		}
	});

	const [fistView, setFirstView] = useState(true);

	if (fistView && !searchFilters.auctionType && initialSearchState.auctionType && provider) {
		// back button
		setFirstView(false);
		onSubmit(initialSearchState);
	}

	// read URL
	useEffect(
		() => {
			if (initialSearchState.auctionType && provider && fistView) {
				onSubmit(initialSearchState);
				setFirstView(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[provider]
	);

	return initialSearchState;
};

const LAST_QUERY = {
	condition: -1,
	page: 0,
	searchFilters: null as any,
	poolList: [] as any,
	convertedPoolInformation: [] as any,
};

const useLastQuery = <T extends Record<string, any>>(q: T, params: T) => {
	useEffect(() => {
		Object.assign(q, params);
	}, Object.values(params));
};

export const OTC = () => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const walletControl = useConnectWalletControl();

	const [poolList, setPoolList] = useState<OtcSearchEntity[]>([]);
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayOTCInfoType[]>(
		[]
	);

	useLastQuery(LAST_QUERY, {
		condition: searchFilters,
		poolList,
		convertedPoolInformation,
		searchFilters,
		page,
	});

	const onSubmit = async (values: any) => {
		if (!provider) {
			if (!(await walletControl.requestAuthorization())) {
				return {
					[FORM_ERROR]: "Please connect web3",
				};
			}
		}

		if (JSON.stringify(LAST_QUERY.condition) === JSON.stringify(values)) {
			setSearchFilters(LAST_QUERY.searchFilters);
			setPoolList(LAST_QUERY.poolList);
			setPage(LAST_QUERY.page);
			// setPoolInformation(LAST_QUERY.poolInformation);
			setConvertedPoolInformation(LAST_QUERY.convertedPoolInformation);

			return;
		}

		setSearchFilters(values);
		setPage(0);
	};

	useEffect(() => {
		if (!searchFilters.auctionType) {
			return;
		}

		(async () => {
			const { auctionType, ...params } = searchFilters;

			const {
				data: foundPools,
				meta: { total },
			} = await fetchOtcSearch(
				chainId,
				auctionType,
				{
					token: params["token-type"],
					poolId: params.pool?.id,
					poolName: params.pool?.name,
					creator: params.pool?.creator,
				},
				{
					page,
					perPage: WINDOW_SIZE,
				}
			);
			setTotalCount(total);
			setPoolList(foundPools);
		})();
	}, [searchFilters, page, chainId]);

	// const queryToken = useTokenQuery();
	const queryToken = useTokenSearchWithFallbackService();

	useEffect(() => {
		if (poolList.length > 0) {
			Promise.all(
				poolList.map(async (pool) => {
					const from = await queryToken(pool.token0);
					const to = await queryToken(pool.token1);

					const total0 = pool.amountTotal0;
					const total = pool.amountTotal1;
					const amount = pool.swappedAmount0;

					const openAt = pool.openAt * 1000;
					const closeAt = pool.closeAt * 1000;

					const toAuctionType = {
						0: OTC_TYPE.sell,
						1: OTC_TYPE.buy,
					};

					const auctionType = toAuctionType[pool.otcType];

					return {
						status: getStatus(openAt, closeAt, amount, total),
						id: +pool.poolID,
						name: `${pool.name} ${OTC_SHORT_NAME_MAPPING[auctionType]}`,
						address: from.address,
						type: OTC_SHORT_NAME_MAPPING[auctionType],
						token: from.address,
						total: parseFloat(fromWei(total, to.decimals).toFixed(6, 1)),
						currency: to.address,
						price: parseFloat(getSwapRatio(total, total0, to.decimals, from.decimals)),
						fill: getProgress(amount, total0, from.decimals),
						href: `/${OTC_PATH}/${auctionType}/${pool.poolID}`,
					};
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [poolList, provider, queryToken]);

	const initialSearchState = useURLControl(searchFilters, provider, onSubmit);

	return (
		<OTCView
			onSubmit={onSubmit}
			result={convertedPoolInformation.length ? convertedPoolInformation : undefined}
			initialSearchState={initialSearchState}
			currentPage={page}
			numberOfPages={Math.ceil(totalCount / WINDOW_SIZE)}
			onBack={() => setPage(page - 1)}
			onNext={() => setPage(page + 1)}
		/>
	);
};
