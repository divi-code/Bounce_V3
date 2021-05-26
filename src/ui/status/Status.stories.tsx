import { POOL_STATUS } from "@app/utils/pool";

import { Status } from "./Status";

const STATUS = {
	live: "Live",
	filled: "Filled",
	closed: "Closed",
	error: "",
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
