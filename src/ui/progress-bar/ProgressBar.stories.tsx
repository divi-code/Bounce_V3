import { ProgressBar } from "./ProgressBar";

export const Default = () => {
	return (
		<div style={{ width: 240 }}>
			<ProgressBar status="live" fillInPercentage={30} />
		</div>
	);
};

export const Filled = () => {
	return (
		<div style={{ width: 240 }}>
			<ProgressBar status="filled" fillInPercentage={30} />
		</div>
	);
};

export const Closed = () => {
	return (
		<div style={{ width: 240 }}>
			<ProgressBar status="closed" fillInPercentage={30} />
		</div>
	);
};
