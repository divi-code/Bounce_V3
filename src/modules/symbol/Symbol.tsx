import { FC } from "react";

import { useTokenSearch } from "@app/web3/api/tokens";

export const Symbol: FC<{ token: string }> = ({ token }) => {
	const findToken = useTokenSearch();
	const tokenInfo = findToken(token);

	if (!token) {
		return null;
	}

	return <>{tokenInfo.symbol}</>;
};
