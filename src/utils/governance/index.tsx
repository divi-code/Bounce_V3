export enum PROPOSAL_STATUS {
	LIVE = "live",
	PASSED = "passed",
	FAILED = "failed",
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
