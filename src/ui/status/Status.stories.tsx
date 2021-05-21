import { Status } from "./Status";

const STATUS = {
	live: "Live",
	filled: "Filled",
	closed: "Closed",
};

export const Default = () => {
	return (
		<div>
			<Status status="live" captions={STATUS} />
		</div>
	);
};

export const Filled = () => {
	return (
		<div>
			<Status status="filled" captions={STATUS} />
		</div>
	);
};

export const Closed = () => {
	return (
		<div>
			<Status status="closed" captions={STATUS} />
		</div>
	);
};
