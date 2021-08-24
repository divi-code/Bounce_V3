import classNames from "classnames";
import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { NavLink } from "@app/ui/button";
import { ProgressBar } from "@app/ui/governance-progress-bar";
import { Status } from "@app/ui/status";
import { Caption, Heading2, Body1 } from "@app/ui/typography";

import { POOL_STATUS } from "@app/utils/pool";
import { toThousands } from "@app/utils/toThousands";

import styles from "./Card.module.scss";

export type DisplayGovernanceInfoType = {
	href?: string;
	status: POOL_STATUS;
	endTime: number;
	id: number;
	name: string;
	fill: number;
	proposer: string;
	description: string;
	forAmount: number;
	againstAmount: number;
};

export const Card: FC<DisplayGovernanceInfoType & MaybeWithClassName & { bordered?: boolean }> = ({
	className,
	href,
	status,
	endTime,
	id,
	fill,
	name,
	bordered,
	proposer,
	description,
	forAmount,
	againstAmount,
}) => {
	const STATUS: Record<POOL_STATUS, string> = {
		[POOL_STATUS.COMING]: "Coming soon",
		[POOL_STATUS.LIVE]: "Live",
		[POOL_STATUS.FILLED]: "Filled",
		[POOL_STATUS.CLOSED]: "Closed",
		[POOL_STATUS.ERROR]: "Error",
	};

	return (
		<NavLink
			className={classNames(className, styles.component, bordered && styles.bordered)}
			href={href}
		>
			<Status className={styles.status} status={POOL_STATUS.LIVE} captions={STATUS} />
			<Caption Component="span" className={styles.id} lighten={50}>
				#{id}
			</Caption>

			<Heading2 className={styles.title} Component="h3">
				<span className={styles.name}>{name}</span>
			</Heading2>
			<Caption Component="span" className={styles.proposer} lighten={50}>
				{`Proposer: ${proposer.replace(/^(.{7}).*(.{5})$/, "$1...$2")}`}
			</Caption>

			<Body1 className={styles.description} lighten={50}>
				{description}
			</Body1>

			<Caption Component="span" className={styles.strVoteFor} lighten={50}>
				Votes For:
			</Caption>
			<Caption Component="span" className={styles.strVoteAgainst} lighten={50}>
				Votes Against:
			</Caption>

			<ProgressBar className={styles.bar} fillInPercentage={fill} status={status} />

			<Caption Component="span" className={styles.forAmount} lighten={50}>
				{`${toThousands(forAmount) || "--"} Auction`}
			</Caption>
			<Caption Component="span" className={styles.againstAmount} lighten={50}>
				{`${toThousands(againstAmount) || "--"} Auction`}
			</Caption>
		</NavLink>
	);
};
