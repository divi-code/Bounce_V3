import { FC } from "react";

import { useAutomaticReconnection } from "@app/web3/hooks/use-connection";

export const ApplicationWrappers: FC = ({ children }) => {
	useAutomaticReconnection();

	return <>{children}</>;
};
