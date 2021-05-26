import { FC } from "react";

import { TokenListProvider } from "@app/web3/api/tokens";
import { useAutomaticReconnection } from "@app/web3/hooks/use-connection";

export const ApplicationWrappers: FC = ({ children }) => {
	useAutomaticReconnection();

	return <TokenListProvider>{children}</TokenListProvider>;
};
