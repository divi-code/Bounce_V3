import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { fetchActivitiesSearch } from "@app/api/my-activity/api";
import { ActivitySearchEntity } from "@app/api/my-activity/types";
import { Pagination } from "@app/modules/pagination";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Account.module.scss";

const WINDOW_SIZE = 9;
const EMPTY_ARRAY = [];

export const Activity = () => {
	const chainId = useChainId();
	const { account } = useWeb3React();
	const provider = useWeb3Provider();

	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

	const [poolList, setPoolList] = useState<ActivitySearchEntity[]>([]);

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
			setPoolList(foundPools);
			console.log("result", foundPools);
		})();
	}, [page, chainId]);

	return (
		<div>
			{poolList && poolList.length > 0 && (
				<div>
					<ul className={styles.cardList}>
						{poolList.map((activity) => (
							<li key={activity.id}>{activity.id}</li>
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
