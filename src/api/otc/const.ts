export enum OTC_TYPE {
	sell = "sell",
	buy = "buy",
}

export const OTC_NAME_MAPPING = {
	[OTC_TYPE.sell]: "I want to sell",
	[OTC_TYPE.buy]: "I want to buy",
};

export const OTC_CREATE_NAME_MAPPING = {
	[OTC_TYPE.sell]: "OTC Sell",
	[OTC_TYPE.buy]: "OTC Buy",
};

export const OTC_SHORT_NAME_MAPPING = {
	[OTC_TYPE.sell]: "Sell",
	[OTC_TYPE.buy]: "Buy",
};
