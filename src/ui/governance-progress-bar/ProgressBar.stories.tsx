import { POOL_STATUS } from "@app/utils/pool";

import { ProgressBar } from "./ProgressBar";

export const Default = () => {
	return (
		<div style={{ width: 240 }}>
			<ProgressBar status={POOL_STATUS.LIVE} fillInPercentage={30} />
		</div>
	);
};

export const Filled = () => {
	return (
		<div style={{ width: 240 }}>
			<ProgressBar status={POOL_STATUS.FILLED} fillInPercentage={30} />
		</div>
	);
};

export const Closed = () => {
	return (
		<div style={{ width: 240 }}>
			<ProgressBar status={POOL_STATUS.CLOSED} fillInPercentage={30} />
		</div>
	);
};
