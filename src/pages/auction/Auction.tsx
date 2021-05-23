import classNames from "classnames";
import { FORM_ERROR } from "final-form";
import { FC, useEffect, useState } from "react";

import { Form } from "react-final-form";

import { uid } from "react-uid";

import { fetchPoolSearch } from "@app/api/pool/api";
import { POOL_NAME_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";
import { PoolSearchField } from "@app/modules/pool-search-field";
import { Search } from "@app/modules/search";

import { SelectField } from "@app/modules/select-field";
import { SelectTokenField } from "@app/modules/select-token-field";
import { Button } from "@app/ui/button";
import { FoldableSection } from "@app/ui/foldable-section";
import { GutterBox } from "@app/ui/gutter-box";
import { PopupTeleporterTarget } from "@app/ui/pop-up-container";

import { PoolInfoType, queryPoolInformation } from "@app/web3/api/bounce/pool-search";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";
import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

import styles from "./Auction.module.scss";
import { Card, CardType } from "./ui/card";

type AuctionType = {
	result?: CardType[];
	onSubmit?(values: any): any;
};

const LIST = [
	// {
	// 	label: "All Auctions Types",
	// 	key: METHODS.all,
	// },
	{
		label: "Fixed Swap Auction",
		key: POOL_TYPE.fixed,
	},
	// {
	// 	label: "Sealed-Bid Auction",
	// 	key: METHODS.sealed_bid,
	// },
	// {
	// 	label: "English Auction",
	// 	key: METHODS.english,
	// },
	// {
	// 	label: "Dutch Auction",
	// 	key: METHODS.dutch,
	// },
	// {
	// 	label: "Lottery Auction",
	// 	key: METHODS.dutch,
	// },
];

export const AuctionView: FC<AuctionType & MaybeWithClassName> = ({
	className,
	result,
	onSubmit,
}) => {
	return (
		<>
			<div className={classNames(className, styles.component)}>
				<Search
					className={classNames(styles.search, result === undefined && styles.fullscreen)}
					title="Find Auction"
					text="Fill in the fields optional below to easily find the auction that suits you"
					visibleText={result === undefined}
				>
					<Form onSubmit={onSubmit}>
						{(sub) => (
							<form onSubmit={sub.handleSubmit} className={styles.form}>
								<SelectTokenField name="token-type" placeholder="Select a token" />
								<SelectField
									required
									name="auctionType"
									placeholder="Choose Auction Type"
									options={LIST}
								/>
								<PoolSearchField placeholder="Pool Information (Optional)" name="pool" />
								<Button
									className={styles.submit}
									size="large"
									color="ocean-blue"
									variant="contained"
									submit
								>
									Search
								</Button>
							</form>
						)}
					</Form>
				</Search>
				<FoldableSection open={!!result} timeout={300} ssr>
					<section className={styles.result}>
						<GutterBox>
							{result && (
								<ul className={styles.list}>
									{result.map((auction) => (
										<li key={uid(auction)} className={styles.item}>
											<Card
												href={auction.href}
												id={auction.id}
												status={auction.status}
												name={auction.name}
												address={auction.address}
												type={auction.type}
												tokenSymbol={auction.tokenSymbol}
												tokenCurrency={auction.tokenCurrency}
												auctionAmount={auction.auctionAmount}
												auctionCurrency={auction.auctionCurrency}
												auctionPrice={auction.auctionPrice}
												time={auction.time}
												fillInPercentage={auction.fillInPercentage}
											/>
										</li>
									))}
								</ul>
							)}
						</GutterBox>
					</section>
				</FoldableSection>
			</div>
			<PopupTeleporterTarget />
		</>
	);
};

const WINDOW_SIZE = 10;

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
		const page = 10;
		setSearchWindow(poolList.slice(page * WINDOW_SIZE, (page + 1) * WINDOW_SIZE));
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
			setPoolInformation(pools);
			console.log(pools);
		})();
	}, [chainId, searchWindow, provider]);

	const convertedPoolInformation: CardType[] = poolInformation.map((pool) => {
		return {
			href: "",
			status: pool.status,
			time: pool.closeTime,
			id: pool.poolID,
			name: pool.poolName,
			address: pool.creator,
			type: POOL_NAME_MAPPING[searchFilters.auctionType],
			tokenCurrency: pool.fromToken.symbol,
			tokenSymbol: "",
			auctionAmount: pool.toBidAmount,
			auctionCurrency: pool.toToken.symbol,
			auctionPrice: pool.currentPrice,
			fillInPercentage: pool.progress,
		};
	});

	return (
		<AuctionView
			onSubmit={onSubmit}
			result={poolInformation.length ? convertedPoolInformation : undefined}
		/>
	);
};
