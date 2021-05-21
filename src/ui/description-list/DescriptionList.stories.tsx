import { DescriptionList } from "./DescriptionList";

const DATA = {
	"Auction amount": "100000.00",
	"Auction currency": "100000.00",
	"Price per unit, $": "33.5",
};

export const Default = () => {
	return (
		<div>
			<DescriptionList title="Token Information" data={DATA} />
		</div>
	);
};
