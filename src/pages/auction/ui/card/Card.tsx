import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { NavLink } from "@app/ui/button";

import { DescriptionList } from "@app/ui/description-list";
import { ProgressBar } from "@app/ui/progress-bar";
import { Status } from "@app/ui/status";
import { Caption, Heading2 } from "@app/ui/typography";

import { walletConversion } from "@app/utils/convertWallet";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./Card.module.scss";

export type CardType = {
	href?: string;
	status: POOL_STATUS;
	time: string;
	id: string | number;
	name: string;
	address: string;
	type: string;
	tokenCurrency: string;
	tokenSymbol: string;
	auctionAmount: string;
	auctionCurrency: string;
	auctionPrice: string | number;
	fillInPercentage: number;
};

export const Card: FC<CardType & MaybeWithClassName> = ({
	className,
	status,
	href,
	time,
	id,
	name,
	address,
	type,
	tokenSymbol,
	tokenCurrency,
	auctionAmount,
	auctionCurrency,
	auctionPrice,
	fillInPercentage,
}) => {
	const STATUS: Record<POOL_STATUS, string> = {
		live: time,
		filled: "Filled",
		closed: "Closed",
		error: "Error",
	};

	const TOKEN_INFORMATION = {
		"Contact address": walletConversion(address),
		"Pool type": type,
		"Token symbol": (
			<span style={{ "--icon": `url("${tokenSymbol}")` } as CSSProperties}>{tokenCurrency}</span>
		),
	};

	const AUCTION_INFORMATION = {
		"Auction amount": auctionAmount,
		"Auction currency": auctionCurrency,
		"Price per unit, $": auctionPrice,
	};

	return (
		<NavLink className={classNames(className, styles.component)} href={href}>
			<Status className={styles.status} status={status} captions={STATUS} />
			<Caption className={styles.id} Component="span" lighten={50}>
				#{id}
			</Caption>
			<Heading2 className={styles.title} Component="h3">
				<span>{name}</span>
			</Heading2>
			<DescriptionList
				className={styles.token}
				title="Token Information"
				data={TOKEN_INFORMATION}
			/>
			<DescriptionList
				className={styles.auction}
				title="Auction Information"
				data={AUCTION_INFORMATION}
			/>
			<ProgressBar className={styles.bar} fillInPercentage={fillInPercentage} status={status} />
		</NavLink>
	);
};
