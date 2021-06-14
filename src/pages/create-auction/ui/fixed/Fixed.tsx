import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl, useFlowData } from "@app/modules/flow/hooks";

import { weiToNum } from "@app/utils/bn/wei";
import { getBalance, getTokenContract } from "@app/web3/api/bounce/erc";

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
	limit?: number;
	fixedFormValues: any;
};

const FixedImp = () => {
	const { moveForward, addData, data } = useFlowControl<FixedOutType>();
	const { tokenFrom } = useFlowData<FixedInType>();
	const initialValues = useMemo(
		() => ({ tokenFrom, allocation: "limited", ...data.fixedFormValues }),
		[data.fixedFormValues, tokenFrom]
	);

	const findToken = useTokenSearch();

	const provider = useWeb3Provider();
	const { account } = useWeb3React();

	const [balance, setBalance] = useState("0");

	const tokenContract = getTokenContract(provider, findToken(tokenFrom).address);

	useEffect(() => {
		getBalance(tokenContract, account).then((b) =>
			setBalance(weiToNum(b, findToken(tokenFrom).decimals, 6))
		);
	}, [tokenContract, account, findToken, tokenFrom]);

	const onSubmit = async (values: any) => {
		addData({
			tokenTo: values.tokenTo,
			swapRatio: parseFloat(values.swapRatio),
			amount: parseFloat(values.amount),
			allocation: values.allocation,
			limit: parseFloat(values.limit),
			fixedFormValues: values,
		});

		moveForward();
	};

	return (
		<FixedView
			onSubmit={onSubmit}
			tokenFrom={tokenFrom}
			balance={parseFloat(balance)}
			initialValues={initialValues}
		/>
	);
};

export const Fixed = defineFlowStep<FixedInType, FixedOutType, {}>({
	Body: FixedImp,
});
