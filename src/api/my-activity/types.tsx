export type ActivitySearchToken = {
	address: string;
	coinGeckoID: string;
	currentPrice: number;
	decimals: number;
	largeURL: string;
	name: string;
	smallURL: string;
	symbol: string;
	thumbURL: string;
};

export type ActivitySearchEntity = {
	amount: string;
	auctionType: number;
	businessType: number;
	otc_type: number;
	category: number;
	event: string;
	height: number;
	id: number;
	poolID: string;
	requestor: string;
	token: ActivitySearchToken;
	txHash: string;
	txTime: number;
	transactionAmount: number;
};
