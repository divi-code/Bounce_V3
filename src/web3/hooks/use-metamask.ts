type Ethereum = {
	request(options: { method: "eth_requestAccounts" }): Promise<string[]>;
	request(options: { method: "personal_sign"; params: [string, string] }): Promise<string>;
};
export const useEthereum = (): Ethereum => {
	// @ts-ignore
	return window.ethereum;
};
export const useMetaMask = () => Boolean(useEthereum());
