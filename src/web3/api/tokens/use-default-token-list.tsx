import { TokenInfo } from "@uniswap/token-lists";
import { useMemo } from "react";

import { useChainId } from "@app/web3/hooks/use-web3";

import defaultList from "./defaultList.json";

export const useDefaultTokens = (): TokenInfo[] => {
	const chainId = useChainId();

	return useMemo(() => {
		return ((defaultList as any).tokens as TokenInfo[]).filter(
			(token) => token.chainId === chainId
		);
	}, [chainId]);
};
