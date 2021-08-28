export enum PROPOSAL_STATUS {
	LIVE = "Live",
	PASSED = "Passed",
	FAILED = "Failed",
}

export type MatchedProposalType = {
	status: PROPOSAL_STATUS;
	endTime: number;
	id: number;
	name: string;
	fill: number;
	proposer: string;
	description: string;
	forAmount: number;
	againstAmount: number;
};

export interface IProposal {
	content?: {
		againstFor: string;
		agreeFor: string;
		details: string;
		summary: string;
		type: number;
	};
	yesCount?: string;
	noCount?: string;
	cancelCount?: string;
	creator?: string;
	index?: string;
	status?: PROPOSAL_STATUS;
	time?: string;
	title?: string;
	voteResult?: string;
}
