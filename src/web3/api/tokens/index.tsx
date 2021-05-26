import { TokenList } from "@uniswap/token-lists";
import { useWeb3React } from "@web3-react/core";
import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";

import getTokenList from "@app/web3/api/tokens/get-token-list";
import { DEFAULT_LIST_OF_LISTS } from "@app/web3/api/tokens/lists";

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
