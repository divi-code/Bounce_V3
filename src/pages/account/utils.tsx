export const getActivity = (business: number, auction: number, otc: number) => {
	if (business === 2) {
		if (auction === 1) {
			return "Fixed Swap Auction";
		}
	} else if (business === 1) {
		if (otc === 0) {
			return "Sell OTC";
		}

		if (otc === 1) {
			return "Buy OTC";
		}
	}
};

export type EventType = "Claimed" | "UserClaimed" | "Created" | "Swapped";

enum EVENT {
	CREATED = "Created",
	CLAIMED = "Claim",
	BID = "Bid",
	BUY = "Buy",
	SELL = "Sell",
}

export const getEvent = (event: EventType, business, auction) => {
	if (event === "Claimed" || event === "UserClaimed") {
		return EVENT.CLAIMED;
	}

	if (event === "Created") {
		return EVENT.CREATED;
	}

	if (event === "Swapped") {
		if (business === 2) {
			return EVENT.BID;
		} else {
			if (auction === 0) {
				return EVENT.BUY;
			} else return EVENT.SELL;
		}
	}
};
