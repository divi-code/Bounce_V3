import Web3 from "web3";

export const getMyBalance = (web3: Web3, address: string): Promise<string> => {
	return web3.eth.getBalance(address);
};
