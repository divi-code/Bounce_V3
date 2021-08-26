import { useRouter } from "next/router";
import { FC, useState } from "react";

import { MatchedProposalType, PROPOSAL_STATUS } from "@app/utils/governance";

import { View } from "./View";

export const ProposalDetail: FC<{ proposalId: number }> = ({ proposalId }) => {
	const { back: goBack } = useRouter();

	const [proposal, setProposal] = useState<MatchedProposalType>({
		id: 5,
		status: PROPOSAL_STATUS.LIVE,
		name: "test 5 test 5 test 5 test 5 test 5 test 5 test 5 test 5 test 5 ",
		fill: 50,
		proposer: "0xE748593A061c37739e7f3c74aB8Ada38eeE156fA",
		description:
			"We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. We propose to increase transaction fee to reduce malicious behaviors such as listing scams and wash trade. ",
		forAmount: 1000,
		againstAmount: 500000000,
		endTime: 1629805512,
	});

	return (
		<>
			<View {...proposal} onBack={() => goBack()}></View>
		</>
	);
};
