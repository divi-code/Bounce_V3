import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl, useFlowData } from "@app/modules/flow/hooks";

import { weiToNum } from "@app/utils/bn/wei";
import { getBalance, getTokenContract } from "@app/web3/api/bounce/erc";

import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import { BuyingView } from "./BuyingView";

type BuyingInType = {
	tokenFrom: string;
};

export type BuyingOutType = {
	tokenTo: string;
	unitPrice: number;
	amount: number;
	buyingFormValues: any;
};

const BuyingImp = () => {
	const { moveForward, addData, data } = useFlowControl<BuyingOutType>();
	const { tokenFrom } = useFlowData<BuyingInType>();
	const initialValues = useMemo(
		() => ({ tokenFrom, allocation: "limited", ...data.buyingFormValues }),
		[data.buyingFormValues, tokenFrom]
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

	console.log("balance", balance);

	const onSubmit = async (values: any) => {
		addData({
			tokenTo: values.tokenTo,
			unitPrice: parseFloat(values.unitPrice),
			amount: parseFloat(values.amount),
			buyingFormValues: values,
		});

		moveForward();
	};

	return (
		<BuyingView
			onSubmit={onSubmit}
			tokenFrom={tokenFrom}
			balance={parseFloat(balance)}
			initialValues={initialValues}
		/>
	);
};

export const Buying = defineFlowStep<BuyingInType, BuyingOutType, {}>({
	Body: BuyingImp,
});
