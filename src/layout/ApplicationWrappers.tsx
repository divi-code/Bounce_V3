import { FC } from "react";

// import { useFocusRings } from "@app/hooks/use-focus-rings";
import { TokenListProvider } from "@app/web3/api/tokens";
import { useAutomaticReconnection } from "@app/web3/hooks/use-connection";

export const ApplicationWrappers: FC = ({ children }) => {
	useAutomaticReconnection();
	// useFocusRings();

	return <TokenListProvider>{children}</TokenListProvider>;
};
