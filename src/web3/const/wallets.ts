import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { PROVIDER_POLLING_INTERVAL, RPC_URLS } from "../../const/const";

const metaMaskFactory = () =>
	new InjectedConnector({
		supportedChainIds: [1, 3, 4, 5, 42, 56, 128],
	});

const walletConnectFactory = () =>
	new WalletConnectConnector({
		rpc: { 1: RPC_URLS[1] },
		bridge: "https://bridge.walletconnect.org",
		qrcode: true,
		pollingInterval: PROVIDER_POLLING_INTERVAL,
	});

export const KNOWN_WALLETS = {
	MetaMask: metaMaskFactory,
	WalletConnect: walletConnectFactory,
};

export type KNOWN_WALLET_KEY = keyof typeof KNOWN_WALLETS;
