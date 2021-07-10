import { ADDRESS_MAPPING } from "@app/web3/networks/mapping";

export enum POOL_TYPE {
	all = "all",
	fixed = "fixed",
	sealed_bid = "sealed_bid",
	english = "english",
	dutch = "dutch",
	lottery = "lottery",
}

export const POOL_NAME_MAPPING = {
	[POOL_TYPE.all]: "All",
	[POOL_TYPE.fixed]: "Fixed Swap Auction",
	[POOL_TYPE.sealed_bid]: "Sealed-Bid Auction",
	[POOL_TYPE.english]: "English Auction",
	[POOL_TYPE.dutch]: "Dutch Auction",
	[POOL_TYPE.lottery]: "Lottery Auction",
};

export const POOL_SHORT_NAME_MAPPING = {
	[POOL_TYPE.fixed]: "Fixed Swap",
	[POOL_TYPE.sealed_bid]: "Sealed-Bid",
	[POOL_TYPE.english]: "English",
	[POOL_TYPE.dutch]: "Dutch",
	[POOL_TYPE.lottery]: "Lottery",
};

export const POOL_SPECIFIC_NAME_MAPPING = {
	[POOL_TYPE.fixed]: "Fixed-swap Pool",
	[POOL_TYPE.sealed_bid]: "Sealed-Bid Pool",
	[POOL_TYPE.english]: "English Pool",
	[POOL_TYPE.dutch]: "Dutch Pool",
	[POOL_TYPE.lottery]: "Lottery Pool",
};

export const POOL_ADDRESS_MAPPING = {
	[POOL_TYPE.fixed]: ADDRESS_MAPPING.FIX_SWAP,
};
