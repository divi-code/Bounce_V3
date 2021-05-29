import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl, useFlowData } from "@app/modules/flow/hooks";

import { weiToNum } from "@app/utils/bn/wei";
import { getBalance, getTokenContract } from "@app/web3/api/bounce/contract";

import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import { ALLOCATION_TYPE, FixedView } from "./FixedView";

type FixedInType = {
	tokenFrom: string;
};

export type FixedOutType = {
	tokenTo: string;
	swapRatio: number;
	amount: number;
	allocation: ALLOCATION_TYPE;
	limit: string;
};

const FixedImp = () => {
	const { moveForward, addData } = useFlowControl<FixedOutType>();
	const { tokenFrom } = useFlowData<FixedInType>();

	const findToken = useTokenSearch();

	const provider = useWeb3Provider();
	const { account } = useWeb3React();

	const [balance, setBalance] = useState("0");

	const tokenContract = getTokenContract(provider, findToken(tokenFrom).address);

	useEffect(() => {
		getBalance(tokenContract, account).then((b) =>
			setBalance(weiToNum(b, findToken(tokenFrom).decimals, 0))
		);
	}, [tokenContract, account, findToken, tokenFrom]);

	const onSubmit = async (values: any) => {
		addData({
			tokenTo: values.tokenTo,
			swapRatio: parseInt(values.swapRatio),
			amount: parseInt(values.amount),
			allocation: values.allocation,
			limit: values.limit ? values.limit : "",
		});

		moveForward();
	};

	return <FixedView onSubmit={onSubmit} tokenFrom={tokenFrom} balance={balance} />;
};

export const Fixed = defineFlowStep<FixedInType, FixedOutType, {}>({
	Body: FixedImp,
});
