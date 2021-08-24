import { POOL_STATUS } from "@app/utils/pool";

import { Status } from "./Status";

const STATUS: Record<POOL_STATUS, string> = {
	[POOL_STATUS.COMING]: "Coming soon",
	[POOL_STATUS.LIVE]: "Live",
	[POOL_STATUS.FILLED]: "Filled",
	[POOL_STATUS.CLOSED]: "Closed",
	[POOL_STATUS.ERROR]: "Error",
};

export const Default = () => {
	return (
		<div>
			<Status status={POOL_STATUS.LIVE} captions={STATUS} />
		</div>
	);
};

export const Filled = () => {
	return (
		<div>
			<Status status={POOL_STATUS.FILLED} captions={STATUS} />
		</div>
	);
};

export const Closed = () => {
	return (
		<div>
			<Status status={POOL_STATUS.CLOSED} captions={STATUS} />
		</div>
	);
};
