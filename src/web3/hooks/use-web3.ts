import { useWeb3React } from "@web3-react/core";
import { useDebugValue, useMemo } from "react";
import Web3 from "web3";

import { WEB3_NETWORKS } from "@app/web3/networks/const";

export const useWeb3Provider = () => {
	const { active, library } = useWeb3React();

	return active ? library.provider : null;
};

export const useWeb3 = (): Web3 => {
	const provider = useWeb3Provider();

	return useMemo(() => (provider ? new Web3(provider) : (undefined as any)), [provider]);
};

export const useChainId = (): WEB3_NETWORKS => {
	const { chainId = WEB3_NETWORKS.ETH } = useWeb3React();
	useDebugValue(chainId);

	return chainId;
};

export const hexifyMessage = (msg: string): string =>
	`0x${Buffer.from(msg, "utf8").toString("hex")}`;

export const useConnected = (): boolean => {
	const { active } = useWeb3React();

	return active;
};

export const useAccount = (): string => {
	const { account } = useWeb3React();

	return account;
};
