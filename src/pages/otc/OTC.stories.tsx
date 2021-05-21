import { OTCView } from "./OTC";

const nothing = () => null;

export const Default = () => {
	return (
		<div>
			<OTCView onSubmit={nothing} />
		</div>
	);
};

export const Result = () => {
	return (
		<div>
			<OTCView onSubmit={nothing} result={[]} />
		</div>
	);
};
