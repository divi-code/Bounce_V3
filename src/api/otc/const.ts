export enum OTC_TYPE {
	sell = "sell",
	buy = "buy",
}

export const OTC_NAME_MAPPING = {
	[OTC_TYPE.sell]: "I want to sell",
	[OTC_TYPE.buy]: "I want to buy",
};
