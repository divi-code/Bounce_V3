import { FC } from "react";

import { ConnectWalletBlock } from "@app/modules/connect-wallet-block";
import { useConnected } from "@app/web3/hooks/use-web3";

export const RequireConnectedWallet: FC = ({ children }) => {
	const isConnected = useConnected();

	return isConnected ? <>{children}</> : <ConnectWalletBlock />;
};
