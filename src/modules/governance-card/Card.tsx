import classNames from "classnames";
import { FC, ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Timer } from "@app/modules/timer";
import { NavLink } from "@app/ui/button";
import { ProgressBar } from "@app/ui/governance-progress-bar";
import { Status } from "@app/ui/proposal-status";
import { Caption, Heading2, Body1 } from "@app/ui/typography";

import { PROPOSAL_STATUS, IProposal } from "@app/utils/governance";
import { toThousands } from "@app/utils/toThousands";

import styles from "./Card.module.scss";

// export type DisplayGovernanceInfoType = {
// 	href?: string;
// 	status: PROPOSAL_STATUS;
// 	endTime: number;
// 	id: number;
// 	name: string;
// 	fill: number;
// 	proposer: string;
// 	description: string;
// 	forAmount: number;
// 	againstAmount: number;
// };

interface DisplayGovernanceInfoType extends IProposal {
	href?: string;
}

export const Card: FC<DisplayGovernanceInfoType & MaybeWithClassName & { bordered?: boolean }> = ({
	className,
	bordered = false,
	href = "www.baidu.com",
	content,
	yesCount,
	noCount,
	cancelCount,
	creator,
	index,
	status,
	time,
	title,
	voteResult,
}) => {
	const STATUS: Record<PROPOSAL_STATUS, ReactNode> = {
		[PROPOSAL_STATUS.LIVE]: (
			<Timer
				timer={Number(time) * 1000}
				onZero={() => {
					console.log("on Zero");
				}}
			/>
		),
		[PROPOSAL_STATUS.PASSED]: "Passed",
		[PROPOSAL_STATUS.FAILED]: "Failed",
	};

	return (
		<NavLink
			className={classNames(className, styles.component, bordered && styles.bordered)}
			href={href}
		>
			<Status className={styles.status} status={status} captions={STATUS} />
			<Caption Component="span" className={styles.id} lighten={50}>
				#{index}
			</Caption>

			<Heading2 className={styles.title} Component="h3">
				<span className={styles.name}>{title}</span>
			</Heading2>
			<Caption Component="span" className={styles.proposer} lighten={50}>
				{`Proposer: ${creator?.replace(/^(.{7}).*(.{5})$/, "$1...$2") || "--"}`}
			</Caption>

			<Body1 className={styles.description} lighten={50}>
				{content?.summary || ""}
			</Body1>

			<Caption Component="span" className={styles.strVoteFor} lighten={50}>
				Votes For:
			</Caption>
			<Caption Component="span" className={styles.strVoteAgainst} lighten={50}>
				Votes Against:
			</Caption>

			<ProgressBar
				className={styles.bar}
				fillInPercentage={(Number(yesCount) / (Number(noCount) + Number(yesCount))) * 100}
				status={status}
			/>

			<Caption Component="span" className={styles.forAmount} lighten={50}>
				{`${toThousands(Number(yesCount) / 1e18) || "--"} Auction`}
			</Caption>
			<Caption Component="span" className={styles.againstAmount} lighten={50}>
				{`${toThousands(Number(noCount) / 1e18) || "--"} Auction`}
			</Caption>
		</NavLink>
	);
};
