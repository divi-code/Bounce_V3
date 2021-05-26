import { makeTokenMap } from "@app/web3/api/eth/token/utils";

export const WETH9 = {
	...makeTokenMap(1, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18, "WETH9", "Wrapped Ether"),
	...makeTokenMap(3, "0xc778417E063141139Fce010982780140Aa0cD5Ab", 18, "WETH9", "Wrapped Ether"),
	...makeTokenMap(4, "0xc778417E063141139Fce010982780140Aa0cD5Ab", 18, "WETH9", "Wrapped Ether"),
	...makeTokenMap(5, "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", 18, "WETH9", "Wrapped Ether"),
	...makeTokenMap(42, "0xd0A1E359811322d97991E03f863a0C30C2cF029C", 18, "WETH9", "Wrapped Ether"),
};
