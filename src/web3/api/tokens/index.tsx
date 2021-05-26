import { TokenInfo, TokenList } from "@uniswap/token-lists";
import { useWeb3React } from "@web3-react/core";
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useTokenListControl } from "@app/modules/select-token-field/tokenControl";
import { getEtherChain } from "@app/web3/api/eth/token/token";
import getTokenList from "@app/web3/api/tokens/get-token-list";
import { DEFAULT_LIST_OF_LISTS } from "@app/web3/api/tokens/lists";

import {
	getDefaultTokens,
	useFilterApplicableTokens,
} from "@app/web3/api/tokens/use-default-token-list";
import { useChainId } from "@app/web3/hooks/use-web3";

import resolveENSContentHash from "./ens/ens";

const tokenListContent = createContext<TokenList[]>([]);

export const useTokenList = (): TokenList[] => useContext(tokenListContent);

export const TokenListProvider: FC = ({ children }) => {
	const [tokens, setTokens] = useState<any>([]);

	const { chainId, library, active } = useWeb3React();

	const ensResolver = useCallback(
		async (ensName: string) => {
			if (!library || chainId !== 1) {
				const networkLibrary = library;
				const network = await networkLibrary.getNetwork();

				if (networkLibrary && network.chainId === 1) {
					return resolveENSContentHash(ensName, networkLibrary);
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

export const useAllTokens = (filter: (list: TokenList) => boolean) => {
	const tokenList = useTokenList();
	const chainId = useChainId();
	const ether = getEtherChain(chainId);

	const allTokens = useMemo(() => {
		return [
			[ether],
			getDefaultTokens(),
			...tokenList.filter(filter).map((list) => list.tokens),
		].reduce((acc, item) => {
			acc.push(...item);

			return acc;
		}, []);
	}, [ether, tokenList, filter]);

	return useFilterApplicableTokens(allTokens, chainId);
};

const passAll = () => true;

export const useTokenSearch = () => {
	const tokens = useAllTokens(passAll);

	return (symbol: string): TokenInfo | undefined => tokens.find((token) => token.symbol === symbol);
};
