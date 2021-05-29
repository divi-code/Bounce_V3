import { TokenInfo } from "@uniswap/token-lists";

import { makeToken } from "./utils";

import { WETH9 } from "./weth9";

const tokenCache: Record<number, TokenInfo> = {};

export const getEtherChain = (chainId: number): TokenInfo => {
	if (!tokenCache[chainId]) {
		tokenCache[chainId] = makeToken(
			chainId,
			"0x0000000000000000000000000000000000000000",
			18,
			"ETH",
			"Ether"
		);
	}

	return tokenCache[chainId];
};

export const getEtherChainWrapped = (chainId: number) => {
	return WETH9[chainId];
};
