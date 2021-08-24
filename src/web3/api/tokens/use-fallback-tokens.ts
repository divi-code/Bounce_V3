import { TokenInfo } from "@uniswap/token-lists";

import { useCallback, useMemo } from "react";

import { IToken } from "@app/api/types";
import { useLocalStorage, LocalStorageControl } from "@app/hooks/use-local-storage";
import { queryERC20Token } from "@app/web3/api/eth/api";
import { useTokenSearch } from "@app/web3/api/tokens/index";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";
import { withAsyncCache } from "@app/web3/utils/async-cache";

const EMPTY_LIST = [];

const useFallbackTokenList = (): LocalStorageControl<TokenInfo[]> => {
	const [get = EMPTY_LIST, set] = useLocalStorage<TokenInfo[]>("fallback-tokens-list");

	return [get, set];
};

export const useFallbackTokens = () => {
	const [tokenList, setTokenList] = useFallbackTokenList();
	const provider = useWeb3Provider();
	const chainId = useChainId();

	const find = useCallback(
		(address: string) => {
			return tokenList.find((token) => token.address === address?.toLowerCase());
		},
		[tokenList]
	);

	const add = useCallback(
		(address: string) => {
			withAsyncCache(address, async () => {
				console.log("resolving unknown token", address);

				const newToken: TokenInfo = {
					chainId,
					name: `fallback token`,
					...(await queryERC20Token(provider, address, chainId)),
				};
				console.log("fallback token resolved", address, newToken);
				setTokenList((local = []) => [...local, newToken]);
			});
		},
		[chainId, provider, setTokenList]
	);

	return useMemo(
		() => ({
			find,
			add,
		}),
		[find, add]
	);
};

export const useTokenSearchWithFallbackService = (coin?: IToken) => {
	const findToken = useTokenSearch(coin);
	const fallbackTokens = useFallbackTokens();

	return useCallback(
		(token: string) => {
			const tokenInfo = findToken(token) || fallbackTokens.find(token);

			if (!tokenInfo) {
				fallbackTokens.add(token);
			}

			return tokenInfo || (({ address: token } as any) as TokenInfo);
		},
		[fallbackTokens, findToken]
	);
};

export const useTokenSearchWithFallback = (token: string, coin?: IToken) => {
	const find = useTokenSearchWithFallbackService(coin);

	return token ? find(token) : undefined;
};
