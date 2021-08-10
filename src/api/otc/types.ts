export interface IToken {
	address: string;
	coinGeckoID: string;
	currentPrice: number;
	decimals: number;
	largeURL: string;
	name: string;
	smallURL: string;
	symbol: string;
	thumbURL: string;
}

export type TBusinessType = 1 | 2; // 1: OTC,2: Auction
export type TCategory = 1 | 2; // 1: OTC, 2: Fixed Swap
export type TOtcType = 0 | 1; // 0: Sell, 1: Buy
export type TStatus = 0 | 1 | 2 | 4; // 0: Open, 1: Closed, 2: Filled, 4: Comming soon

export interface OtcSearchEntity {
	amountTotal0: string;
	amountTotal1: string;
	claimedAt: number;
	auctionType: number;
	auctioneer: string;
	businessType: TBusinessType;
	category: TCategory;
	contract: string;
	contractHeight: number;
	contractTxHash: string;
	creator: string;
	currentTotal0: string;
	currentTotal1: string;
	enableWhiteList: number;
	id: number;
	name: string;
	openAt: number;
	otcType: TOtcType;
	poolID: string;
	status: TStatus;
	swappedAmount0: string;
	token0: IToken;
	token1: IToken;
}
