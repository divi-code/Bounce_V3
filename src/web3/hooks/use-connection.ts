import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";

import { KNOWN_WALLETS, KNOWN_WALLET_KEY } from "../const/wallets";

const SELECT_WEB3_PROVIDER_KEY = "SELECTED_WEB3_PROVIDER";

export const useWalletConnection = () => {
	const { activate, deactivate } = useWeb3React();

	return {
		connect: useCallback(
			(name: KNOWN_WALLET_KEY): Promise<void> => {
				return activate(KNOWN_WALLETS[name]()).then(
					() => {
						// store user choice
						window.localStorage.setItem(SELECT_WEB3_PROVIDER_KEY, name);
					},
					(err) => {
						console.error(err);
						// reset failed attempt
						window.localStorage.removeItem(SELECT_WEB3_PROVIDER_KEY);
						throw err;
					}
				);
			},
			[activate]
		),
		disconnect: () => {
			deactivate();
			window.localStorage.removeItem(SELECT_WEB3_PROVIDER_KEY);
		},
	};
};

export const useAutomaticReconnection = () => {
	const { activate, active } = useWeb3React();
	const [wasActive, setWasActive] = useState(false);

	useEffect(
		() => {
			if (!active) {
				const chosenProvider = window.localStorage.getItem(
					SELECT_WEB3_PROVIDER_KEY
				) as KNOWN_WALLET_KEY | null;
				console.log("wallet content", chosenProvider);

				if (chosenProvider && KNOWN_WALLETS[chosenProvider]) {
					console.log("activate", chosenProvider);

					activate(KNOWN_WALLETS[chosenProvider]()).then(
						(data) => console.log("connected", data),
						(e) => console.error("failed to reactivate", e)
					);
				}
			}
		},
		// run only on page mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	useEffect(() => {
		if (active) {
			setWasActive(true);
		}

		if (!active && wasActive) {
			console.log("wallet disconnect");
			// forgetting saved network
			window.localStorage.removeItem(SELECT_WEB3_PROVIDER_KEY);
		}
	}, [active, wasActive]);
};
