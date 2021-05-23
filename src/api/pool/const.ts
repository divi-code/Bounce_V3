export enum POOL_TYPE {
	any = "any",
	fixed = "fixed",
	sealed_bid = "sealed_bid",
	english = "english",
	dutch = "dutch",
	lottery = "lottery",
}

export const POOL_NAME_MAPPING = {
	all: "all",
	[POOL_TYPE.fixed]: "fixed pools",
	[POOL_TYPE.sealed_bid]: "sealed bid_pools",
	[POOL_TYPE.english]: "english pools",
	[POOL_TYPE.dutch]: "dutch auction_pools",
	[POOL_TYPE.lottery]: "lottery pools",
};
