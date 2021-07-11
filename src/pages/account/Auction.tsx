import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import { useEffect, useState } from "react";

import { uid } from "react-uid";

import { fetchPoolSearch } from "@app/api/my-pool/api";
import { PoolSearchEntity } from "@app/api/my-pool/types";
import {
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";
import { AUCTION_PATH } from "@app/const/const";
import { Card, DisplayPoolInfoType } from "@app/modules/auction-card";
import { Pagination } from "@app/modules/pagination";

import { Select } from "@app/ui/select";
import { fromWei } from "@app/utils/bn/wei";
import { getProgress, getStatus, getSwapRatio, POOL_STATUS } from "@app/utils/pool";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Account.module.scss";

const WINDOW_SIZE = 9;
const EMPTY_ARRAY = [];

export const Auction = () => {
	const chainId = useChainId();
	const { account } = useWeb3React();
	const provider = useWeb3Provider();

	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

	const [poolList, setPoolList] = useState<PoolSearchEntity[]>([]);

	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>(
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
			} = await fetchPoolSearch(chainId, account, type, {
				page,
				perPage: WINDOW_SIZE,
			});
			setTotalCount(total);
			setPoolList(foundPools);
			console.log("Auctions", foundPools);
		})();
	}, [page, chainId, type]);

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
						0: POOL_TYPE.all,
						1: POOL_TYPE.fixed,
					};

					const auctionType = toAuctionType[pool.auctionType];

					return {
						status: getStatus(openAt, closeAt, amount, total0),
						id: +pool.poolID,
						name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
						address: from.address,
						type: POOL_SHORT_NAME_MAPPING[auctionType],
						token: from.address,
						total: parseFloat(fromWei(total, to.decimals).toString()),
						currency: to.address,
						price: parseFloat(getSwapRatio(total, total0, to.decimals, from.decimals)),
						fill: getProgress(amount, total0, from.decimals),
						href: `${AUCTION_PATH}/${auctionType}/${pool.poolID}`,
					};
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [poolList, provider, queryToken]);

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
							<li key={uid(auction)}>
								<Card
									href={auction.href}
									id={auction.id}
									status={auction.status}
									name={auction.name}
									address={auction.address}
									type={auction.type}
									token={auction.token}
									total={auction.total}
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
