import classNames from "classnames";
import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Card } from "@app/modules/governance-card";
import { DisplayGovernanceInfoType } from "@app/modules/governance-card";
import { Pagination } from "@app/modules/pagination";
import { GutterBox } from "@app/ui/gutter-box";
import { PopupTeleporterTarget } from "@app/ui/pop-up-container";

import { POOL_STATUS } from "@app/utils/pool";

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
		status: POOL_STATUS.COMING,
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
		status: POOL_STATUS.COMING,
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
		status: POOL_STATUS.COMING,
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
		status: POOL_STATUS.COMING,
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
		status: POOL_STATUS.COMING,
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
				{result && result.length > 0 && (
					<section className={styles.result}>
						<GutterBox>
							{result && (
								<ul className={styles.list}>
									{result.map((proposal) => (
										<li key={proposal.id}>
											<Card
												href={proposal.href}
												id={proposal.id}
												status={proposal.status}
												name={proposal.name}
												fill={proposal.fill}
												proposer={proposal.proposer}
												description={proposal.description}
												forAmount={proposal.forAmount}
												againstAmount={proposal.againstAmount}
												endTime={proposal.endTime}
											/>
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
