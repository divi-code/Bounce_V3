import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { fetchPoolSearch } from "@app/api/pool/api";
import {
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";

import { IPoolSearchEntity } from "@app/api/pool/types";
import { AUCTION_PATH } from "@app/const/const";
import { DisplayPoolInfoType } from "@app/modules/auction-card";
import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { fromWei } from "@app/utils/bn/wei";
import { getProgress, getSwapRatio, POOL_STATUS } from "@app/utils/pool";
import { getIsOpen } from "@app/utils/time";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import { AuctionView } from "./AuctionView";

const WINDOW_SIZE = 9;

export const ToAuctionType = {
	0: POOL_TYPE.all,
	1: POOL_TYPE.fixed,
};

export const ToAuctionStatus = {
	0: POOL_STATUS.LIVE,
	1: POOL_STATUS.CLOSED,
	2: POOL_STATUS.FILLED,
	3: POOL_STATUS.CLOSED,
};

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

				router.push(`${AUCTION_PATH}/${auctionType}/${filters}`, undefined, {
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
				auctionType: router.query.auctionType,
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

export const Auction = () => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const walletControl = useConnectWalletControl();

	const [poolList, setPoolList] = useState<IPoolSearchEntity[]>([]);
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>(
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
			} = await fetchPoolSearch(
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

	const queryToken = useTokenSearchWithFallbackService();

	useEffect(() => {
		console.log(">>>>>>>>>>>>>", poolList);

		if (poolList.length > 0) {
			Promise.all(
				poolList.map(async (pool) => {
					const {
						token0,
						token1,
						amountTotal0,
						amountTotal1,
						swappedAmount0,
						openAt,
					} = pool.poolDetail;
					const isOpen = getIsOpen(openAt * 1000);
					const auctionType = ToAuctionType[pool.auctionType];

					return {
						status: isOpen ? ToAuctionStatus[pool.status] : POOL_STATUS.COMING,
						id: +pool.poolID,
						name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
						address: token0.address,
						type: POOL_SHORT_NAME_MAPPING[auctionType],
						from: token0,
						to: token1,
						total: parseFloat(fromWei(amountTotal1, token1.decimals).toFixed()),
						price: parseFloat(
							getSwapRatio(amountTotal1, amountTotal0, token1.decimals, token0.decimals)
						),
						fill: getProgress(swappedAmount0, amountTotal0, token0.decimals),
						href: `${AUCTION_PATH}/${auctionType}/${pool.poolID}`,
					};
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [poolList, provider, queryToken]);

	const initialSearchState = useURLControl(searchFilters, provider, onSubmit);

	return (
		<AuctionView
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
