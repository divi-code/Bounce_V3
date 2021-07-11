import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import { fetchOtcSearch } from "@app/api/my-otc/api";
import { OtcSearchEntity } from "@app/api/my-otc/types";
import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { OTC_PATH } from "@app/const/const";
import { DisplayOTCInfoType } from "@app/modules/otc-card";
import { Card } from "@app/modules/otc-card";
import { Pagination } from "@app/modules/pagination";

import { Select } from "@app/ui/select";
import { fromWei } from "@app/utils/bn/wei";
import { getProgress, getSwapRatio, POOL_STATUS } from "@app/utils/otc";
import { getDeltaTime, getIsOpen } from "@app/utils/time";
import { getBounceOtcContract } from "@app/web3/api/bounce/otc";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Account.module.scss";

const WINDOW_SIZE = 9;
const EMPTY_ARRAY = [];

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
	const type = checkbox ? "created" : "participated";

	useEffect(() => {
		if (!type) {
			return;
		}

		(async () => {
			const {
				data: foundPools,
				meta: { total },
			} = await fetchOtcSearch(chainId, account, type, {
				page,
				perPage: WINDOW_SIZE,
			});
			setTotalCount(total);
			setPoolList(foundPools);
			console.log("Otcs", foundPools);
		})();
	}, [page, chainId, type]);

	const queryToken = useTokenSearchWithFallbackService();

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

	useEffect(() => {
		if (!contract) {
			return;
		}

		if (poolList.length > 0) {
			Promise.all(
				poolList.map(async (pool) => {
					const from = await queryToken(pool.token0);
					const to = await queryToken(pool.token1);

					const total0 = pool.amountTotal0;
					const total = pool.amountTotal1;
					const amount = pool.swappedAmount0;

					const toAuctionType = {
						0: OTC_TYPE.sell,
						1: OTC_TYPE.buy,
					};

					const auctionType = toAuctionType[pool.otcType];

					const toAuctionStatus = {
						0: POOL_STATUS.LIVE,
						1: POOL_STATUS.CLOSED,
						2: POOL_STATUS.FILLED,
					};

					const isOpen = getIsOpen(pool.openAt * 1000);

					return {
						status: isOpen ? toAuctionStatus[pool.status] : POOL_STATUS.COMING,
						id: +pool.poolID,
						name: `${pool.name} ${OTC_SHORT_NAME_MAPPING[auctionType]}`,
						address: from.address,
						type: OTC_SHORT_NAME_MAPPING[auctionType],
						token: from.address,
						total: parseFloat(fromWei(total, to.decimals).toString()),
						currency: to.address,
						price: parseFloat(getSwapRatio(total, total0, to.decimals, from.decimals)),
						fill: getProgress(amount, total0, from.decimals),
						href: `${OTC_PATH}/${auctionType}/${pool.poolID}`,
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
					options={[
						{
							label: "All",
							key: "all",
						},
						{
							label: "Live",
							// @ts-ignore
							key: POOL_STATUS.LIVE,
						},
						{
							label: "Closed",
							// @ts-ignore
							key: POOL_STATUS.CLOSED,
						},
					]}
					name="status"
					small
				/>
			</div>
			{convertedPoolInformation && convertedPoolInformation.length > 0 && (
				<div>
					<ul className={styles.cardList}>
						{convertedPoolInformation.map((auction) => (
							<li key={auction.id}>
								<Card
									href={auction.href}
									id={auction.id}
									status={auction.status}
									name={auction.name}
									address={auction.address}
									type={auction.type}
									token={auction.token}
									currency={auction.currency}
									price={auction.price}
									fill={auction.fill}
									bordered
								/>
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
