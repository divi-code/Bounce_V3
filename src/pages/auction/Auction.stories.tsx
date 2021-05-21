import { AuctionView } from "./Auction";

const nothing = () => null;

export const Default = () => {
	return (
		<div>
			<AuctionView onSubmit={nothing} />
		</div>
	);
};

export const Result = () => {
	return (
		<div>
			<AuctionView onSubmit={nothing} result={[]} />
		</div>
	);
};
