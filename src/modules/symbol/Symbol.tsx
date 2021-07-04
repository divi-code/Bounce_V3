import { FC } from "react";

import { useTokenSearchWithFallback } from "@app/web3/api/tokens/use-fallback-tokens";

export const Symbol: FC<{ token: string }> = ({ token }) => {
	const tokenInfo = useTokenSearchWithFallback(token);

	if (!token) {
		return null;
	}

	if (!tokenInfo) {
		return <span>...</span>;
	}

	return <>{tokenInfo.symbol}</>;
};
