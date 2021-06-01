import { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
	POOL_ADDRESS_MAPPING,
	POOL_SHORT_NAME_MAPPING,
	POOL_SPECIFIC_NAME_MAPPING,
	POOL_TYPE,
} from "@app/api/pool/const";
import { Currency } from "@app/modules/currency";
import { Form } from "@app/modules/form";
import { DisplayPoolInfoType } from "@app/pages/auction";
import { AuctionDetailView } from "@app/pages/auction-detail/AuctionDetailView";
import { getAlertForOwner } from "@app/pages/auction-detail/getAlerts";
import { Alert, ALERT_TYPE } from "@app/ui/alert";
import { DescriptionList } from "@app/ui/description-list";
import { weiToNum } from "@app/utils/bn/wei";
import { getProgress, getStatus, getSwapRatio } from "@app/utils/pool";
import { getBounceContract, getMyAmount, getPools } from "@app/web3/api/bounce/contract";
import { useTokenQuery } from "@app/web3/api/tokens";
import { useAccount, useChainId, useConnected, useWeb3Provider } from "@app/web3/hooks/use-web3";

type AlertType = {
	title: string;
	text: string;
	type: ALERT_TYPE;
};

export const AuctionDetail: FC<{ poolID: number; auctionType: POOL_TYPE }> = ({
	poolID,
	auctionType,
}) => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const queryToken = useTokenQuery();
	const isConnected = useConnected();
	const account = useAccount();

	const [pool, setPool] = useState<
		DisplayPoolInfoType & {
			amount: string;
			openAt: number;
			closeAt: number;
			creator: string;
			claimAt?: number;
			limit?: string;
		}
	>();
	const [bid, setBid] = useState<string>();
	const [myPool, setMyPool] = useState<boolean>(false);
	const [alert, setAlert] = useState<AlertType | undefined>();

	const contract = useMemo(
		() => getBounceContract(provider, POOL_ADDRESS_MAPPING[auctionType], chainId),
		[auctionType, chainId, provider]
	);

	const updateData = useCallback(async () => {
		if (!contract) {
			return;
		}

		//get pool info

		const pool = await getPools(contract, poolID);
		const bid = await getMyAmount(contract, account, poolID);

		const from = await queryToken(pool.token0);
		const to = await queryToken(pool.token1);

		const fromTotal = pool.amountTotal0;
		const toTotal = pool.amountTotal1;

		const fromAmount = pool.amountSwap0;
		const toAmount = pool.amountSwap1;

		const matchedPool = {
			status: getStatus(pool.openAt, pool.closeAt, fromAmount, fromTotal),
			id: poolID,
			name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
			address: from.address,
			type: POOL_SHORT_NAME_MAPPING[auctionType],
			token: from.symbol,
			total: weiToNum(fromTotal, from.decimals, 0),
			amount: fromAmount ? weiToNum(fromAmount, from.decimals, 6) : "0",
			currency: to.symbol,
			price: getSwapRatio(fromTotal, toTotal, from.decimals, to.decimals),
			fill: fromAmount ? getProgress(fromAmount, fromTotal) : 0,
			openAt: pool.openAt,
			closeAt: pool.closeAt,
			creator: pool.creator,
			claimAt: pool.claimAt > pool.closeAt ? pool.claimAt : undefined,
			limit: pool.limit ? weiToNum(pool.limit, from.decimals, 0) : undefined,
		};
		setPool(matchedPool);
		setBid(bid);

		if (pool.creator === account) {
			setMyPool(true);
		}

		//set alerts

		if (pool.creator === account) {
			setAlert(getAlertForOwner(pool.openAt, pool.closeAt, pool.amountSwap0, pool.amountTotal0));
		}
	}, [account, auctionType, contract, poolID, queryToken]);

	const onRequestData = updateData;

	useEffect(() => {
		if (isConnected) {
			updateData();
		}
	}, [isConnected, updateData]);

	useEffect(() => {
		const tm = setInterval(updateData, 60000);

		return () => clearInterval(tm);
	}, [updateData]);

	const getTitle = () => {
		if (!myPool) {
			if (parseFloat(bid) > 0) {
				return "You Joined";
			} else return "Join The Pool";
		} else return "My Pool";
	};

	if (pool) {
		return (
			<AuctionDetailView
				status={pool.status}
				id={pool.id}
				address={pool.address}
				type={pool.type}
				token={pool.token}
				total={pool.total}
				amount={pool.amount}
				name={pool.name}
				currency={pool.currency}
				price={pool.price}
				fill={pool.fill}
				openAt={+pool.openAt / 1000}
				closeAt={+pool.closeAt / 1000}
				onZero={onRequestData}
				actionTitle={getTitle()}
				claimAt={pool.claimAt ? new Date(+pool.claimAt) : undefined}
				limit={pool.limit ? pool.limit : undefined}
				alert={alert && <Alert title={alert.title} text={alert.text} type={alert.type} />}
			>
				{myPool ? (
					<DescriptionList
						data={{
							"Bid swap ratio": (
								<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
									1{"\u00a0"}
									<Currency token={pool.token} small />
									{"\u00a0"}={"\u00a0"}
									{pool.price}
									{"\u00a0"}
									<Currency token={pool.currency} small />
								</span>
							),
							"Total bid amount": (
								<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
									{pool.amount}
									{"\u00a0"}
									<Currency token={pool.currency} small />
								</span>
							),
						}}
					/>
				) : (
					<Form onSubmit={() => null}>{}</Form>
				)}
			</AuctionDetailView>
		);
	}

	return null;
};
