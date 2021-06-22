import { TokenInfo } from "@uniswap/token-lists";

export const makeToken = (
	chainId: number,
	address: string,
	decimals: number,
	symbol: string,
	name: string,
	logoURI: string
): TokenInfo => ({
	chainId,
	address,
	decimals,
	symbol,
	name,
	logoURI,
	// isNative: true,
});

export const makeTokenMap = (
	chainId: number,
	address: string,
	decimals: number,
	symbol: string,
	name: string,
	logoURI: string
) => ({
	[chainId]: makeToken(chainId, address, decimals, symbol, name, logoURI),
});
