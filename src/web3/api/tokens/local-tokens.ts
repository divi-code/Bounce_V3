import { TokenInfo } from "@uniswap/token-lists";

import { useLocalStorage } from "@app/hooks/use-local-storage";

const EMPTY_LIST = [];

export const useLocallyDefinedTokens = (): [TokenInfo[], (x: TokenInfo[]) => void] => {
	const [get = EMPTY_LIST, set] = useLocalStorage<TokenInfo[]>("local-tokens-list");

	return [get, set];
};
