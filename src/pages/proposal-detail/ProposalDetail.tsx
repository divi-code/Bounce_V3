import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { MatchedProposalType, PROPOSAL_STATUS, IProposal } from "@app/utils/governance";
import { useGovDetail } from "@app/web3/api/bounce/governance";

import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import { View } from "./View";

export const ProposalDetail: FC<{ proposalIndex: number; proposalId: string }> = ({
	proposalId,
	proposalIndex,
}) => {
	const { back: goBack } = useRouter();

	const { gov } = useGovDetail(proposalId);

	const [proposalDetail, setProposalDetail] = useState<IProposal>();

	const { popUp, close, open } = useControlPopUp();

	useEffect(() => {
		if (JSON.stringify(gov) === JSON.stringify({})) return;
		setProposalDetail(gov);
	}, [gov]);

	return (
		<>
			<View {...proposalDetail} proposalIndex={proposalIndex} onBack={() => goBack()}></View>
			{/* {popUp.defined ? (
				<ProcessingPopUp
					title={"Vote PopUp"}
					text={"Vote PopUp text text"}
					onSuccess={() => {
						close();
					}}
					onTry={() => console.log("on Try Again")}
					isSuccess={false}
					isLoading={true}
					isError={false}
					control={popUp}
					close={() => {
						close();
					}}
				/>
			) : undefined} */}
		</>
	);
};
