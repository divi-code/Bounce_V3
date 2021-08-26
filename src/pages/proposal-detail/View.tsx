import classnames from "classnames";
import { FC, useState, useEffect, ReactNode } from "react";

import { CopyAddress } from "@app/modules/copy-to-clipboard";
import { DisplayGovernanceInfoType } from "@app/modules/governance-card";

import { Timer } from "@app/modules/timer";
import { PrimaryButton, Button } from "@app/ui/button";
import { ProgressBar } from "@app/ui/governance-progress-bar";
import { Status } from "@app/ui/governance-status";
import { GutterBox } from "@app/ui/gutter-box";
import { RightArrow } from "@app/ui/icons/arrow-right";
import { Body1, Caption, Heading1, Heading2, Heading3 } from "@app/ui/typography";
import { PROPOSAL_STATUS } from "@app/utils/governance";
import { toThousands } from "@app/utils/toThousands";

import styles from "./View.module.scss";

type ProposalDetailViewType = {
	// actionTitle: string;
	// alert?: ReactNode;
	// amount: number;
	// limit?: number;
	// openAt: number;
	// closeAt: number;
	// claimAt?: Date;
	// onZero(): void;
	onBack(): void;
};

export const View: FC<DisplayGovernanceInfoType & ProposalDetailViewType> = ({
	id,
	name,
	children,
	status,
	description,
	fill,
	proposer,
	forAmount,
	againstAmount,
	endTime,
	onBack,
}) => {
	const STATUS: Record<PROPOSAL_STATUS, ReactNode> = {
		[PROPOSAL_STATUS.LIVE]: <Timer timer={endTime} onZero={() => console.log("ON ZERO")} />,
		[PROPOSAL_STATUS.PASSED]: "Passed",
		[PROPOSAL_STATUS.FAILED]: "Failed",
	};

	const [ActiveTabKey, setActiveTabKey] = useState<number>(1);

	useEffect(() => {
		console.log("ActiveTabKey: ", ActiveTabKey);
	}, [ActiveTabKey]);

	return (
		<section className={styles.component}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						<Button
							variant="text"
							color="primary-black"
							onClick={onBack}
							iconBefore={
								<RightArrow style={{ width: 8, marginRight: 12, transform: "rotate(180deg)" }} />
							}
						>
							Go Back
						</Button>

						<Caption Component="span" weight="medium">
							#{id}
						</Caption>
					</div>

					<div className={styles.titleTimer}>
						<Status status={status} captions={STATUS} />
						<Heading1 className={styles.title}>{name}</Heading1>

						<div className={styles.address}>
							<CopyAddress
								className={styles.copy}
								labelAddress={proposer.replace(/^(.{7}).*(.{5})$/, "$1...$2")}
								address={proposer}
							/>
						</div>
					</div>

					<div className={styles.infoWrapper}>
						<Body1 className={styles.description}>{description}</Body1>
						<GutterBox className={styles.voteInfo}>
							<Heading2 className={styles.votesAmount}>{`${
								forAmount + againstAmount
							} votes:`}</Heading2>

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
						</GutterBox>
					</div>

					<GutterBox className={styles.votePanel}>
						<Heading2 className={styles.strMakeDecision}>make your decision</Heading2>

						<div className={styles.tabsWrapper}>
							<ul className={styles.tabs}>
								<Button
									className={classnames(styles.tab, ActiveTabKey === 1 ? styles.active : null)}
									onClick={() => setActiveTabKey(1)}
								>
									<Heading3 className={styles.strVoteFor}>Vote For</Heading3>
									<Caption Component="span" className={styles.price}>
										0.0356 ETH
									</Caption>
								</Button>
								<Button
									className={classnames(styles.tab, ActiveTabKey === 2 ? styles.active : null)}
									onClick={() => setActiveTabKey(2)}
								>
									<Heading3 className={styles.strVoteFor}>Vote Against</Heading3>
									<Caption Component="span" className={styles.price}>
										0.0356 ETH
									</Caption>
								</Button>
								<Button
									className={classnames(styles.tab, ActiveTabKey === 3 ? styles.active : null)}
									onClick={() => setActiveTabKey(3)}
								>
									<Heading3 className={styles.strVoteFor}>Vote Neutral</Heading3>
									<Caption Component="span" className={styles.price}>
										0.0356 ETH
									</Caption>
								</Button>
							</ul>
						</div>

						<Caption Component="p" className={styles.description}>
							I vote in favor of Dutch Auction format for future Governance Vault sales.
						</Caption>

						<PrimaryButton
							className={styles.submitBtn}
							submit
							onClick={() => console.log(">>>>> submit")}
						>
							<Body1 className={styles.strSubmit}>Submit</Body1>
						</PrimaryButton>
					</GutterBox>
				</div>
			</GutterBox>
		</section>
	);
};
