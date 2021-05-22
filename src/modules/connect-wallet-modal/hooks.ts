import { useContext } from "react";

import { context } from "./ConnectWalletProvider";

export const useConnectWalletControl = () => {
	const { open, requestAuthorization } = useContext(context);

	return { requestAuthorization, open };
};
