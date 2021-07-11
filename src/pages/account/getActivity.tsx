export const getActivity = (business: number, auction: number) => {
	if (business === 2) {
		if (auction === 1) {
			return "Fixed Swap Auction";
		}
	} else if (business === 1) {
		if (auction === 0) {
			return "Sell OTC";
		}

		if (auction === 1) {
			return "Buy OTC";
		}
	}
};
