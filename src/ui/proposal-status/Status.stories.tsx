import { PROPOSAL_STATUS } from "@app/utils/governance";

import { Status } from "./Status";

const STATUS: Record<PROPOSAL_STATUS, string> = {
	[PROPOSAL_STATUS.LIVE]: "Live",
	[PROPOSAL_STATUS.PASSED]: "Passed",
	[PROPOSAL_STATUS.FAILED]: "Failed",
};

export const Default = () => {
	return (
		<div>
			<Status status={PROPOSAL_STATUS.LIVE} captions={STATUS} />
		</div>
	);
};

export const Passed = () => {
	return (
		<div>
			<Status status={PROPOSAL_STATUS.PASSED} captions={STATUS} />
		</div>
	);
};

export const Closed = () => {
	return (
		<div>
			<Status status={PROPOSAL_STATUS.FAILED} captions={STATUS} />
		</div>
	);
};
