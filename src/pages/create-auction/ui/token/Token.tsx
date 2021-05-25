import { useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl } from "@app/modules/flow/hooks";

import { ProvideTokenInformation } from "@app/modules/provide-token-information";

type TokenOutType = {
	tokenFrom: string;
	address: string;
	decimal: string;
};

const TokenImp = () => {
	const { moveForward, addData } = useFlowControl<TokenOutType>();

	const onSubmit = async (values: any) => {
		addData({ tokenFrom: values.tokenFrom, address: values.address, decimal: values.decimal });
		moveForward();
	};

	const [decimal, setDecimal] = useState<string | undefined>();
	const [address, setAddress] = useState<string | undefined>();

	const getAddressByToken = (e: string) => {
		return "0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c3333";
	};

	const getDecimalByToken = (e: string) => {
		return "2";
	};

	const onTokenChange = (token: string) => {
		if (token) {
			setDecimal(getDecimalByToken(token));
			setAddress(getAddressByToken(token));
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
