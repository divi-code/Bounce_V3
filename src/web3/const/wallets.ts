import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { WEB3_NETWORKS } from "@app/web3/networks/const";

export const RPC_URLS = {
	[WEB3_NETWORKS.MAIN]: "https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX",
	[WEB3_NETWORKS.RINKEBY]: "https://rinkeby.infura.io/v3/bd80ce1ca1f94da48e151bb6868bb150",
	[WEB3_NETWORKS.BINANCE]: "https://bsc-dataseed.binance.org",
};

const SUPPORTED_CHAIN_IDS = [WEB3_NETWORKS.MAIN, WEB3_NETWORKS.RINKEBY, WEB3_NETWORKS.BINANCE];

const metaMaskFactory = () =>
	new InjectedConnector({
		supportedChainIds: SUPPORTED_CHAIN_IDS,
	});

const walletConnectFactory = () =>
	new WalletConnectConnector({
		rpc: RPC_URLS,
		// supportedChainIds: SUPPORTED_CHAIN_IDS,
		// infuraId: "099fc58e0de9451d80b18d7c74caa7c1", // obviously a hack
		bridge: "https://bridge.walletconnect.org",
		qrcode: true,
		pollingInterval: 15000,
	});

export const KNOWN_WALLETS = {
	MetaMask: metaMaskFactory,
	WalletConnect: walletConnectFactory,
};

export type KNOWN_WALLET_KEY = keyof typeof KNOWN_WALLETS;
