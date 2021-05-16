import { useWeb3React } from "@web3-react/core";

export const useConnected = (): boolean => {
	const { active } = useWeb3React();

	return active;
};
