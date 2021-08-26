import classNames from "classnames";
import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Card } from "@app/modules/governance-card";
import { DisplayGovernanceInfoType } from "@app/modules/governance-card";
import { Pagination } from "@app/modules/pagination";
import { Button } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";
import { PopupTeleporterTarget } from "@app/ui/pop-up-container";
import { Caption, Heading2, Body1 } from "@app/ui/typography";

import { PROPOSAL_STATUS } from "@app/utils/governance";

import styles from "./Governance.module.scss";

type GovernanceType = {
	result?: DisplayGovernanceInfoType[];
	// initialSearchState: any;
	// numberOfPages: number;
	// currentPage: number;
	onBack?(): void;
	onNext?(): void;
	onSubmit?(values: any): any;
};

const result: DisplayGovernanceInfoType[] = [
	{
		id: 1,
		href: "www.baidu.com",
		status: PROPOSAL_STATUS.LIVE,
		name: "test 1",
		fill: 50,
		proposer: "0xE748593A061c37739e7f3c74aB8Ada38eeE156fA",
		description: "We propose",
		forAmount: 1000,
		againstAmount: 10000000,
		endTime: 1629805512,
	},
	{
		id: 2,
		href: "www.baidu.com",
		status: PROPOSAL_STATUS.LIVE,
		name: "test 2",
		fill: 50,
		proposer: "0xE748593A061c37739e7f3c74aB8Ada38eeE156fA",
		description:
			"We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. ",
		forAmount: 1000,
		againstAmount: 500000000,
		endTime: 1629805512,
	},
	{
		id: 3,
		href: "www.baidu.com",
		status: PROPOSAL_STATUS.LIVE,
		name: "test 3 test 3 test 3 test 3 test 3 test 3 test 3 test 3",
		fill: 50,
		proposer: "0xE748593A061c37739e7f3c74aB8Ada38eeE156fA",
		description:
			"We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. ",
		forAmount: 1000,
		againstAmount: 500000000,
		endTime: 1629805512,
	},
	{
		id: 4,
		href: "www.baidu.com",
		status: PROPOSAL_STATUS.LIVE,
		name: "test 4",
		fill: 50,
		proposer: "0xE748593A061c37739e7f3c74aB8Ada38eeE156fA",
		description:
			"We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. ",
		forAmount: 1000,
		againstAmount: 500000000,
		endTime: 1629805512,
	},
	{
		id: 5,
		href: "www.baidu.com",
		status: PROPOSAL_STATUS.LIVE,
		name: "test 5 test 5 test 5 test 5 test 5 test 5 test 5 test 5 test 5 ",
		fill: 50,
		proposer: "0xE748593A061c37739e7f3c74aB8Ada38eeE156fA",
		description:
			"We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. ",
		forAmount: 1000,
		againstAmount: 500000000,
		endTime: 1629805512,
	},
];

export const GovernanceView: FC<GovernanceType & MaybeWithClassName> = ({
	className /* , result */,
}) => {
	return (
		<>
			<div className={classNames(className, styles.component)}>
				<div className={styles.banner}>
					<div className={styles.fakeTab}>
						<Body1 className={styles.strVoting}>Voting</Body1>
						<Button color="primary-white">
							<Body1 className={styles.strCreateProposal}>+ Create Proposal</Body1>
						</Button>
					</div>

					<div className={styles.bannerText}>
						<Caption Component="span" className={styles.strVotePower} lighten={50}>
							Your Voting Power:
						</Caption>
						<div className={styles.line2}>
							<Heading2 className={styles.powerAmount}>0,3</Heading2>
							&nbsp;
							<Body1 className={styles.strVotes}>Votes</Body1>
						</div>
					</div>
				</div>

				{result && result.length > 0 && (
					<section className={styles.result}>
						<GutterBox>
							{result && (
								<ul className={styles.list}>
									{result.map((proposal) => (
										<li key={proposal.id} className="animate__animated animate__flipInY">
											<Card {...proposal} />
										</li>
									))}
								</ul>
							)}
						</GutterBox>
					</section>
				)}
			</div>
			<PopupTeleporterTarget />
		</>
	);
};
