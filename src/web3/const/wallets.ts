import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { WEB3_NETWORKS } from "@app/web3/networks/const";

const SUPPORTED_CHAIN_IDS = [WEB3_NETWORKS.MAIN, WEB3_NETWORKS.RINKEBY, WEB3_NETWORKS.BINANCE];

const INFURA_ID = "cb93aa2debf642e58fb91ea913c3e1c4";

const metaMaskFactory = () =>
	new InjectedConnector({
		supportedChainIds: SUPPORTED_CHAIN_IDS,
	});

const walletConnectFactory = () =>
	new WalletConnectConnector({
		supportedChainIds: SUPPORTED_CHAIN_IDS,
		infuraId: INFURA_ID,
		bridge: "https://bridge.walletconnect.org",
		qrcode: true,
		pollingInterval: 15000,
	});

export const KNOWN_WALLETS = {
	MetaMask: metaMaskFactory,
	WalletConnect: walletConnectFactory,
};

export type KNOWN_WALLET_KEY = keyof typeof KNOWN_WALLETS;
