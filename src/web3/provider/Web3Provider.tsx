import React, { useEffect } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ConnectWalletPopUp } from "../../modules/connect-wallet-pop-up";
import { useControlPopUp } from "../../hooks/use-control-popup";

function getLibrary(provider) {
	const library = new Web3Provider(provider);
	library.pollingInterval = 8000;
	return library;
}

export const Web3ProviderRoot = ({ children }) => (
	<Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
);
