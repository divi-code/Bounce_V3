import classNames from "classnames";
import { FC } from "react";
import { uid } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Form } from "@app/modules/form";
import { PoolSearchField } from "@app/modules/pool-search-field";
import { Search } from "@app/modules/search";
import { SelectAuction } from "@app/modules/select-auction";
import { SelectTokenField } from "@app/modules/select-token-field";
import styles from "@app/pages/auction/Auction.module.scss";
import { Card, CardType } from "@app/pages/auction/ui/card";

import { Button } from "@app/ui/button";
import { FoldableSection } from "@app/ui/foldable-section";
import { GutterBox } from "@app/ui/gutter-box";

import { PopupTeleporterTarget } from "@app/ui/pop-up-container";

type AuctionType = {
	result?: CardType[];
	onSubmit?(values: any): any;
};

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
					<Form className={styles.form} onSubmit={onSubmit}>
						<div>
							<SelectTokenField name="token-type" placeholder="Select a token" />
						</div>
						<div>
							<SelectAuction required name="auctionType" />
						</div>
						<div>
							<PoolSearchField placeholder="Pool Information (Optional)" name="pool" />
						</div>
						<Button
							className={styles.submit}
							size="large"
							color="ocean-blue"
							variant="contained"
							submit
						>
							Search
						</Button>
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
