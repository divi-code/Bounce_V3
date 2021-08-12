import { TokenInfo } from "@uniswap/token-lists";
import { useMemo } from "react";

import { IToken } from "@app/api/types";

import defaultList from "./defaultList.json";

export const getDefaultTokens = (): TokenInfo & IToken[] => {
	return (defaultList as any).tokens as TokenInfo & IToken[];
};

export const useFilterApplicableTokens = <T extends TokenInfo>(
	tokenList: T[],
	chainId: number
): T[] => {
	return useMemo(() => {
		return tokenList.filter((token) => token.chainId === chainId);
	}, [tokenList, chainId]);
};
