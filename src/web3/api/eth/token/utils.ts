export const makeToken = (
	chainId: number,
	address: string,
	decimals: number,
	symbol: string,
	name: string
) => ({
	chainId,
	address,
	decimals,
	symbol,
	name,

	isNative: true,
});

export const makeTokenMap = (
	chainId: number,
	address: string,
	decimals: number,
	symbol: string,
	name: string
) => ({
	[chainId]: makeToken(chainId, address, decimals, symbol, name),
});
