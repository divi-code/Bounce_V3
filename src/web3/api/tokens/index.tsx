import { TokenInfo, TokenList } from "@uniswap/token-lists";
import { useWeb3React } from "@web3-react/core";
import { kashe, inboxed } from "kashe";
import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";

import { AbstractProvider } from "web3-core";

import { queryERC20Token } from "@app/web3/api/eth/api";
import { useLocallyDefinedTokens } from "@app/web3/api/tokens/local-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import { getEtherChain } from "../eth/token/token";

import resolveENSContentHash from "./ens/ens";
import getTokenList from "./get-token-list";
import { DEFAULT_LIST_OF_LISTS } from "./lists";
import { getDefaultTokens } from "./use-default-token-list";

const tokenListContent = createContext<TokenList[]>([]);

export const useTokenList = (): TokenList[] => useContext(tokenListContent);

export const TokenListProvider: FC = ({ children }) => {
	const [tokens, setTokens] = useState<any>([]);

	const { chainId, library, active } = useWeb3React();

	const ensResolver = useCallback(
		async (ensName: string) => {
			if (!library || chainId !== 1) {
				const network = await library.getNetwork();

				if (library && network.chainId === 1) {
					return resolveENSContentHash(ensName, library);
				}

				throw new Error("Could not construct mainnet ENS resolver");
			}

			return resolveENSContentHash(ensName, library);
		},
		[chainId, library]
	);

	useEffect(() => {
		if (active) {
			Promise.all(
				DEFAULT_LIST_OF_LISTS.map((listUrl) =>
					getTokenList(listUrl, ensResolver).catch((e) => {
						console.log(e);

						return undefined;
					})
				)
			).then((allTokens) => {
				setTokens(allTokens.filter(Boolean));
			});
		}
	}, [ensResolver, active]);

	return <tokenListContent.Provider value={tokens}>{children}</tokenListContent.Provider>;
};

const markAs = (tokenList: TokenInfo[], name: string) =>
	tokenList.map((token) => ({ ...token, source: name }));

type ExtendedTokenInfo = TokenInfo & { source: string };
type TokenLookup<T extends TokenInfo> = Record<string, T>;

const generateTokenList = inboxed(
	kashe(
		(
			ether: TokenInfo,
			customTokenList: TokenInfo[],
			tokenList: TokenList[],
			chainId: number,
			filter: (list: TokenList) => boolean
		): ExtendedTokenInfo[] => {
			const m = [
				markAs([ether], "native"),
				markAs(customTokenList, "custom"),
				markAs(getDefaultTokens(), "default"),
				...tokenList.filter(filter).map((list) => markAs(list.tokens, list.name)),
			].reduce((acc, item) => {
				item.forEach((token) => acc.set(`${token.address}-${token.chainId}`, token));

				return acc;
			}, new Map<string, ExtendedTokenInfo>());

			const allTokens = Array.from(m.values());

			return allTokens.filter((token) => token.chainId === chainId);
		}
	)
);

const mapToTokenLookup = kashe(
	(tokens: ExtendedTokenInfo[]): TokenLookup<ExtendedTokenInfo> =>
		tokens.reduce((acc, token) => {
			acc[token.address?.toLowerCase()] = token;

			return acc;
		}, {} as TokenLookup<ExtendedTokenInfo>)
);

export const useAllTokens = (filter: (list: TokenList) => boolean) => {
	const tokenList = useTokenList();
	const chainId = useChainId();
	const ether = getEtherChain(chainId);
	const [customTokenList] = useLocallyDefinedTokens();

	// note: cache is split on filter, then on ether
	return generateTokenList(filter, ether, customTokenList, tokenList, chainId, filter);
};

export const useAllTokensSearch = (filter: (list: TokenList) => boolean) => {
	const tokens = useAllTokens(filter);

	return mapToTokenLookup(tokens);
};

const passAll = () => true;

export const useTokenSearch = () => {
	const tokens = useAllTokensSearch(passAll);

	return useCallback((address: string) => (address ? tokens[address?.toLowerCase()] : undefined), [
		tokens,
	]);
};

const getCacheFrom = kashe(<T extends unknown>(_source: any): Record<string, T> => ({}));

const cachedERC20Query = async (
	provider: AbstractProvider,
	address,
	chainID: number,
	tokens: TokenLookup<TokenInfo>
) => {
	const token = await queryERC20Token(provider, address, chainID);

	return {
		...tokens[address.toLowerCase()],
		...token,
	};
};

const STABLE_REF = {};

export const useTokenQuery = () => {
	const tokens = useAllTokensSearch(passAll);
	const provider = useWeb3Provider();
	const chainId = useChainId();

	const cache = getCacheFrom<Promise<TokenInfo>>(provider || STABLE_REF);

	return useCallback(
		(address: string): Promise<TokenInfo> => {
			if (provider) {
				if (!cache[address]) {
					cache[address] = cachedERC20Query(provider, address, chainId, tokens);
				}

				return cache[address];
			}
		},
		[cache, chainId, provider, tokens]
	);
};
