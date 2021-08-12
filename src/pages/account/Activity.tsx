import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";

import { uid } from "react-uid";

import { fetchActivitiesSearch } from "@app/api/my-activity/api";
import { ActivitySearchEntity } from "@app/api/my-activity/types";
import { Currency } from "@app/modules/currency";
import { Pagination } from "@app/modules/pagination";
import { Body1, Caption } from "@app/ui/typography";
import { fromWei } from "@app/utils/bn/wei";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Account.module.scss";
import { EventType, getActivity, getEvent } from "./utils";

const WINDOW_SIZE = 20;
const EMPTY_ARRAY = [];

export const Activity = () => {
	const chainId = useChainId();
	const { account } = useWeb3React();
	const provider = useWeb3Provider();

	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

	const [activityList, setActivityList] = useState<ActivitySearchEntity[]>([]);

	const [convertedActivityInformation, setConvertedActivityInformation] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			const {
				data: foundPools,
				meta: { total },
			} = await fetchActivitiesSearch(chainId, account, {
				page,
				perPage: WINDOW_SIZE,
			});
			setTotalCount(total);
			setActivityList(foundPools);
		})();
	}, [page, chainId]);

	const queryToken = useTokenSearchWithFallbackService();

	useEffect(() => {
		if (activityList.length > 0) {
			Promise.all(
				activityList.map(async (pool) => {
					// const token = await queryToken(pool.token);

					return {
						event: getEvent(pool.event as EventType, pool.businessType, pool.otc_type),
						category: getActivity(pool.businessType, pool.auctionType, pool.otc_type),
						id: +pool.poolID,
						token: pool.token,
						amount: fromWei(pool.amount, pool.token.decimals).toString(),
						date: moment(pool.txTime * 1000).fromNow(),
						transactionAmount: pool.transactionAmount,
					};
				})
			).then((info) => setConvertedActivityInformation(info));
		} else {
			setConvertedActivityInformation(EMPTY_ARRAY);
		}
	}, [activityList, provider, queryToken]);

	return (
		<div>
			{convertedActivityInformation && convertedActivityInformation.length > 0 && (
				<div>
					<div className={styles.head}>
						<Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
							Event
						</Caption>
						<Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
							Category
						</Caption>
						<Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
							Pool ID
						</Caption>
						<Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
							Token
						</Caption>
						<Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
							Amount
						</Caption>
						<Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
							Date
						</Caption>
					</div>
					<ul className={styles.body}>
						{convertedActivityInformation.map((activity) => (
							<li key={uid(activity)} className={styles.row}>
								<Body1
									className={classNames(
										styles.cell,
										styles.cellEvent,
										styles[`cell${activity.event}`]
									)}
									Component="span"
								>
									{activity.event}
								</Body1>
								<Body1 className={styles.cell} Component="span">
									{activity.category}
								</Body1>
								<Body1 className={classNames(styles.cell, styles.cellId)} Component="span">
									#{activity.id}
								</Body1>
								<Body1 className={styles.cell} Component="span">
									<Currency coin={activity.token} />
								</Body1>
								<Body1 className={styles.cell} Component="span">
									<span>{activity.amount}</span>&nbsp;
									<span className={styles.cellAmount}>(${activity.transactionAmount})</span>
								</Body1>
								<Body1 className={styles.cell} Component="span">
									{activity.date}
								</Body1>
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
