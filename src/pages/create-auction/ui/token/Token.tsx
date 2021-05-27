import { useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl } from "@app/modules/flow/hooks";

import { ProvideTokenInformation } from "@app/modules/provide-token-information";
import { useTokenSearch } from "@app/web3/api/tokens";

export type TokenOutType = {
	tokenFrom: string;
	tokenAddress: string;
	tokenDecimal: string;
};

const TokenImp = () => {
	const { moveForward, addData } = useFlowControl<TokenOutType>();

	const onSubmit = async (values: any) => {
		addData({
			tokenFrom: values.tokenFrom,
			tokenAddress: values.address,
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

	return (
		<ProvideTokenInformation
			onSubmit={onSubmit}
			onTokenChange={onTokenChange}
			address={address}
			decimal={decimal}
		/>
	);
};

export const Token = defineFlowStep<{}, TokenOutType, {}>({
	Body: TokenImp,
});
