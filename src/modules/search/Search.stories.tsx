import { Search } from "./Search";

export const Default = () => {
	return (
		<div>
			<Search
				title="Find Auction"
				text="Fill in the fields optional below to easily find the auction that suits you"
			>
				<div style={{ width: 1248, height: 60, backgroundColor: "white" }} />
			</Search>
		</div>
	);
};
