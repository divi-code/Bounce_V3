import classNames from "classnames";
import { FC } from "react";

import { Form } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { PoolSearchField } from "@app/modules/pool-search-field";
import { Search } from "@app/modules/search";

import { SelectField } from "@app/modules/select-field";
import { SelectTokenField } from "@app/modules/select-token-field";
import { Button } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";
import { PopupTeleporterTarget } from "@app/ui/pop-up-container";

import styles from "./OTC.module.scss";

type AuctionType = {
	result?: any;
	onSubmit?(): void;
};

//TODO: replace list

const LIST = [
	{
		label: "All Auctions Types",
		key: "all",
	},
	{
		label: "Fixed Swap Auction",
		key: "fixed",
	},
	{
		label: "Sealed-Bid Auction",
		key: "sealed-bid",
	},
	{
		label: "English Auction",
		key: "english",
	},
	{
		label: "Dutch Auction",
		key: "dutch",
	},
	{
		label: "Lottery Auction",
		key: "lottery",
	},
];

export const OTCView: FC<AuctionType & MaybeWithClassName> = ({ className, result, onSubmit }) => {
	return (
		<>
			<div className={classNames(className, styles.component)}>
				<Search
					className={classNames(styles.search, result === undefined && styles.fullscreen)}
					title="Find OTC"
					text="Fill in the fields optional below to easily find the auction that suits you"
					visibleText={result === undefined}
				>
					<Form onSubmit={onSubmit}>
						{(sub) => (
							<form onSubmit={sub.handleSubmit} className={styles.form}>
								<div>
									<SelectTokenField name="token-type" placeholder="Select a token" />
								</div>
								<div>
									<SelectField
										name="auction-status"
										placeholder="Choose Auction Type"
										options={LIST}
									/>
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
							</form>
						)}
					</Form>
				</Search>
				{result && (
					<section>
						<GutterBox>{result}</GutterBox>
					</section>
				)}
			</div>
			<PopupTeleporterTarget />
		</>
	);
};

export const OTC = () => <OTCView onSubmit={() => null} result={undefined} />;
