export interface IPoolSearchParticipants {
	account: string;
	claimed: boolean;
	currentTotal0: string;
	fee: string;
	id: number;
	poolID: string;
	swappedAmount0: string;
}

export interface IPoolDetail {
	amountTotal0: string;
	amountTotal1: string;
	claimedAt: number;
	closedAt: number;
	creatorClaimed: true;
	currentTotal0: string;
	currentTotal1: string;
	enableWhiteList: number;
	id: number;
	openAt: number;
	poolID: string;
	swapped_amount0: string;
	token0: string;
	token1: string;
}
export interface IPoolSearchEntity {
	auctionType: number;
	auctioneer: string;
	businessType: number;
	category: number;
	contract: string;
	contractHeight: number;
	contractTxHash: string;
	creator: string;
	id: number;
	name: string;
	participants: IPoolSearchParticipants[];
	poolDetail: IPoolDetail;
	poolID: string;
	status: number;
}
