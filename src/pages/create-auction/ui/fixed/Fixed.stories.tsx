import { FixedView } from "./FixedView";

export const Default = () => {
	return (
		<div>
			<FixedView tokenFrom="ETH" balance="100" onSubmit={() => alert("Submit")} />
		</div>
	);
};
