import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { fetchOtcSearch } from "@app/api/otc/api";
import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { OtcSearchEntity } from "@app/api/otc/types";

import { OTC_PATH } from "@app/const/const";
import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { DisplayOTCInfoType } from "@app/modules/otc-card";
import { OTCView } from "@app/pages/otc/OTCView";
import { fromWei } from "@app/utils/bn/wei";
import { getProgress, getSwapRatio, POOL_STATUS } from "@app/utils/otc";
import { getDeltaTime, getIsOpen } from "@app/utils/time";
import { getBounceOtcContract } from "@app/web3/api/bounce/otc";
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

const ToAuctionType = {
	0: OTC_TYPE.sell,
	1: OTC_TYPE.buy,
};

const ToAuctionStatus = {
	0: POOL_STATUS.LIVE,
	1: POOL_STATUS.CLOSED,
	2: POOL_STATUS.FILLED,
};

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

				router.push(`${OTC_PATH}/${auctionType}/${filters}`, undefined, {
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

		// if (JSON.stringify(LAST_QUERY.condition) === JSON.stringify(values)) {
		// 	setSearchFilters(LAST_QUERY.searchFilters);
		// 	setPoolList(LAST_QUERY.poolList);
		// 	setPage(LAST_QUERY.page);
		// 	// setPoolInformation(LAST_QUERY.poolInformation);
		// 	setConvertedPoolInformation(LAST_QUERY.convertedPoolInformation);

		// 	return;
		// }

		setSearchFilters({ ...values });
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

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

	useEffect(() => {
		if (!contract) {
			return;
		}

		if (poolList.length > 0) {
			Promise.all(
				poolList.map(async (pool) => {
					const { token0, token1, amountTotal0, amountTotal1, swappedAmount0, openAt } = pool;
					const isOpen = getIsOpen(openAt * 1000);
					const otcType = ToAuctionType[pool.otcType];
					const tempStatus = isOpen ? ToAuctionStatus[pool.status] : POOL_STATUS.COMING;

					return {
						status: pool.status === 1 ? ToAuctionStatus[pool.status] : tempStatus,
						id: +pool.poolID,
						name: `${pool.name} ${OTC_SHORT_NAME_MAPPING[otcType]}`,
						address: token0.address,
						type: OTC_SHORT_NAME_MAPPING[otcType],
						token: token0.address,
						from: token0,
						to: token1,
						total: parseFloat(fromWei(amountTotal1, token1.decimals).toFixed()),
						currency: token1.address,
						price: parseFloat(
							getSwapRatio(amountTotal1, amountTotal0, token1.decimals, token0.decimals)
						),
						fill: getProgress(swappedAmount0, amountTotal0, token0.decimals),
						href: `${OTC_PATH}/${otcType}/${pool.poolID}`,
					};
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [contract, poolList, provider, queryToken]);

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
