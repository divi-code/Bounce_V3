import { useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl } from "@app/modules/flow/hooks";

import { ProvideTokenInformation } from "@app/modules/provide-token-information";
import { useTokenSearch } from "@app/web3/api/tokens";
import { useChainId } from "@app/web3/hooks/use-web3";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { defineNetworkMapper } from "@app/web3/networks/utils";

export type TokenOutType = {
	tokenFrom: string;
	tokenFromAddress: string;
	tokenDecimal: string;
};

const TokenImp = () => {
	const { moveForward, addData } = useFlowControl<TokenOutType>();

	const chainId = useChainId();

	const onSubmit = async (values: any) => {
		addData({
			tokenFrom: values.tokenFrom,
			tokenFromAddress: values.address,
			tokenDecimal: values.decimal,
		});

		moveForward();
	};

	const [decimal, setDecimal] = useState<number | undefined>();
	const [address, setAddress] = useState<string | undefined>();

	const findToken = useTokenSearch();

	const onTokenChange = (token: string) => {
		if (token) {
			const record = findToken(token);

			if (record) {
				setDecimal(record.decimals);
				setAddress(record.address);
			}
		}
	};

	const getLinkByNetwork = defineNetworkMapper({
		[WEB3_NETWORKS.MAIN]: `https://mainnet.etherscan.io/address/${address}`,
		[WEB3_NETWORKS.RINKEBY]: `https://rinkeby.etherscan.io/address/${address}`,
		[WEB3_NETWORKS.BINANCE]: `https://rinkeby.etherscan.io/address/${address}`,
	});

	return (
		<ProvideTokenInformation
			onSubmit={onSubmit}
			onTokenChange={onTokenChange}
			address={address}
			decimal={decimal}
			href={getLinkByNetwork(chainId)}
		/>
	);
};

export const Token = defineFlowStep<{}, TokenOutType, {}>({
	Body: TokenImp,
});
