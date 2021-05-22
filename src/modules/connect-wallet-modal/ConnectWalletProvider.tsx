import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { ConnectWalletModal } from "@app/modules/connect-wallet-modal/ConnectWalletModal";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

type WalletPopupControlType = {
	requestAuthorization(): Promise<boolean>;
	open(): void;
};

export const context = createContext<WalletPopupControlType>(null as any);

export const ConnectWalletProvider: FC = ({ children }) => {
	const { open, close, popUp } = useControlPopUp();

	const provider = useWeb3Provider();

	const [resolveModalClose, setResolveModalClose] = useState<any>(null);

	const requestAuthorization = useCallback(async (): Promise<boolean> => {
		open();

		return new Promise((resolve) => {
			setResolveModalClose(() => (value: boolean) => {
				resolve(value);
			});
		});
	}, [open]);

	const isOpen = popUp.defined;

	useEffect(
		() => {
			if (!isOpen && resolveModalClose) {
				resolveModalClose(Boolean(provider));
				setResolveModalClose(null);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isOpen, provider]
	);

	const contextValues = useMemo(
		() => ({
			requestAuthorization,
			open,
		}),
		[requestAuthorization, open]
	);

	return (
		<context.Provider value={contextValues}>
			{children}
			{popUp.defined ? <ConnectWalletModal control={popUp} close={close} /> : null}
		</context.Provider>
	);
};
