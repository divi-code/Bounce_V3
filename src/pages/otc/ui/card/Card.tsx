import classNames from "classnames";
import { CSSProperties, FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { NavLink } from "@app/ui/button";

import { DescriptionList } from "@app/ui/description-list";
import { ProgressBar } from "@app/ui/progress-bar";
import { Status } from "@app/ui/status";
import { Heading2 } from "@app/ui/typography";

import { walletConversion } from "@app/utils/convertWallet";

import styles from "./Card.module.scss";

type StatusType = "live" | "filled" | "closed";

type CardType = {
	href?: string;
	status: StatusType;
	id: string;
	name: string;
	address: string;
	type: string;
	tokenCurrency: string;
	tokenSymbol: string;
	acceptableCurrency: string;
	otcPrice: string;
	fillInPercentage: number;
};

export const Card: FC<CardType & MaybeWithClassName> = ({
	className,
	status,
	href,
	id,
	name,
	address,
	type,
	tokenSymbol,
	tokenCurrency,
	acceptableCurrency,
	otcPrice,
	fillInPercentage,
}) => {
	const STATUS = {
		live: "Live",
		filled: "Filled",
		closed: "Closed",
	};

	const TOKEN_INFORMATION = {
		"Contact address": walletConversion(address),
		"OTC type": type,
		"Token symbol": (
			<span style={{ "--icon": `url("${tokenSymbol}")` } as CSSProperties}>{tokenCurrency}</span>
		),
	};

	const OTC_INFORMATION = {
		"Acceptable currency": acceptableCurrency,
		"Price per unit, $": otcPrice,
	};

	return (
		<NavLink className={classNames(className, styles.component)} href={href}>
			<Status className={styles.status} status={status} captions={STATUS} />
			<span className={styles.id}>#{id}</span>
			<Heading2 className={styles.title} Component="h3">
				<span>{name}</span>
			</Heading2>
			<DescriptionList
				className={styles.token}
				title="Token Information"
				data={TOKEN_INFORMATION}
			/>
			<DescriptionList className={styles.otc} title="OTC Offer" data={OTC_INFORMATION} />
			<ProgressBar className={styles.bar} fillInPercentage={fillInPercentage} status={status} />
		</NavLink>
	);
};
