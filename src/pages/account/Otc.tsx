import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import { fetchOtcSearch } from "@app/api/my-otc/api";
import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { OtcSearchEntity } from "@app/api/otc/types";
import { OTC_PATH } from "@app/const/const";
import { DisplayOTCInfoType } from "@app/modules/otc-card";
import { Card } from "@app/modules/otc-card";
import { Pagination } from "@app/modules/pagination";

import { Select } from "@app/ui/select";
import { fromWei } from "@app/utils/bn/wei";
import { getProgress, getSwapRatio, POOL_STATUS } from "@app/utils/otc";
import { getIsOpen } from "@app/utils/time";
import { getBounceOtcContract } from "@app/web3/api/bounce/otc";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Account.module.scss";

const WINDOW_SIZE = 9;
const EMPTY_ARRAY = [];

const STATUS_OPTIONS = [
	{
		label: "All",
		key: "all",
	},
	{
		label: "Coming soon",
		key: "comingSoon",
	},
	{
		label: "Live",
		key: "open",
	},
	{
		label: "Closed",
		key: "closed",
	},
	{
		label: "Filled",
		key: "filled",
	},
];
const ToAuctionType = {
	0: OTC_TYPE.sell,
	1: OTC_TYPE.buy,
};
const ToAuctionStatus = {
	0: POOL_STATUS.LIVE,
	1: POOL_STATUS.CLOSED,
	2: POOL_STATUS.FILLED,
};

export const Otc = () => {
	const chainId = useChainId();
	const { account } = useWeb3React();
	const provider = useWeb3Provider();

	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

	const [poolList, setPoolList] = useState<OtcSearchEntity[]>([]);

	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayOTCInfoType[]>(
		[]
	);

	const [checkbox, setCheckbox] = useState<boolean>(false);
	const [status, setStatus] = useState<string>(STATUS_OPTIONS[0].key);

	const type = checkbox ? "created" : "participated";

	useEffect(() => {
		if (!type) {
			return;
		}

		(async () => {
			const {
				data: foundPools,
				meta: { total },
			} = await fetchOtcSearch(
				chainId,
				account,
				type,
				{
					page,
					perPage: WINDOW_SIZE,
				},
				status
			);
			setTotalCount(total);
			setPoolList(foundPools);
		})();
	}, [page, chainId, type, account, status]);

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

					return {
						status: isOpen ? ToAuctionStatus[pool.status] : POOL_STATUS.COMING,
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
	}, [poolList, provider, queryToken]);

	// @ts-ignore
	// @ts-ignore
	return (
		<div>
			<div className={styles.filters}>
				<label className={styles.label}>
					<input type="checkbox" onChange={() => setCheckbox(!checkbox)} checked={checkbox} />
					<span className={classNames(styles.toggle, checkbox && styles.checked)}>Created</span>
					<span className={classNames(styles.toggle, !checkbox && styles.checked)}>
						Participated
					</span>
				</label>
				<Select
					className={styles.select}
					options={STATUS_OPTIONS}
					name="status"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					small
				/>
			</div>
			{convertedPoolInformation && convertedPoolInformation.length > 0 && (
				<div>
					<ul className={styles.cardList}>
						{convertedPoolInformation.map((auction) => (
							<li key={auction.id} className="animate__animated animate__flipInY">
								<Card {...auction} bordered />
							</li>
						))}
					</ul>
					{numberOfPages > 1 && (
						<Pagination
							className={styles.pagination}
							numberOfPages={numberOfPages}
							currentPage={page}
							onBack={() => setPage(page - 1)}
							onNext={() => setPage(page + 1)}
						/>
					)}
				</div>
			)}
		</div>
	);
};
