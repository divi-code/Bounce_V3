import classNames from "classnames";
import { FC } from "react";

import { IToken } from "@app/api/types";
import { MaybeWithClassName } from "@app/helper/react/types";

import { Currency, GeckoToken } from "@app/modules/currency";
import { NavLink } from "@app/ui/button";

import { DescriptionList } from "@app/ui/description-list";
import { ProgressBar } from "@app/ui/progress-bar";
import { Status } from "@app/ui/status";
import { Caption, Heading2 } from "@app/ui/typography";

import { walletConversion } from "@app/utils/convertWallet";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./Card.module.scss";

export type DisplayPoolInfoType = {
	href?: string;
	status: POOL_STATUS;
	id: string | number;
	name: string;
	type: string;
	total: number;
	from: IToken;
	to: IToken;
	price: number;
	fill: number;
	needClaim?: boolean;
};

export const Card: FC<DisplayPoolInfoType & MaybeWithClassName & { bordered?: boolean }> = ({
	className,
	bordered,
	needClaim,
	status,
	href,
	id,
	name,
	type,
	total,
	from,
	to,
	price,
	fill,
}) => {
	const STATUS: Record<POOL_STATUS, string> = {
		[POOL_STATUS.COMING]: "Coming soon",
		[POOL_STATUS.LIVE]: "Live",
		[POOL_STATUS.FILLED]: "Filled",
		[POOL_STATUS.CLOSED]: "Closed",
		[POOL_STATUS.ERROR]: "Error",
	};

	const TOKEN_INFORMATION = {
		"Contact address": (
			<GeckoToken isGecko={!!from.coinGeckoID} token={walletConversion(from.address)} />
		),
		"Token symbol": <Currency coin={from} small />,
	};

	const AUCTION_INFORMATION = {
		"Pool type": type,
		"Auction amount": total,
		"Auction currency": <Currency coin={to} small />,
		"Price per unit, $": price,
	};

	return (
		<NavLink
			className={classNames(className, styles.component, bordered && styles.bordered)}
			href={href}
		>
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
			<ProgressBar className={styles.bar} fillInPercentage={fill} status={status} />
			{needClaim && <div className={styles.claim}>Need to claim token</div>}
		</NavLink>
	);
};
