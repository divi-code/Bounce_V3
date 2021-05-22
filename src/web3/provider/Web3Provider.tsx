import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import React from "react";

function getLibrary(provider) {
	const library = new Web3Provider(provider);
	library.pollingInterval = 8000;

	return library;
}

export const Web3ProviderRoot = ({ children }) => (
	<Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
);
