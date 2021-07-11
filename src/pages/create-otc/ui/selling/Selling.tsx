import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl, useFlowData } from "@app/modules/flow/hooks";

import { fromWei } from "@app/utils/bn/wei";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";

import { isEth } from "@app/web3/api/eth/use-eth";
import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3, useWeb3Provider } from "@app/web3/hooks/use-web3";

import { SellingView } from "./SellingView";

type SellingInType = {
	tokenFrom: string;
};

export type SellingOutType = {
	tokenTo: string;
	unitPrice: number;
	amount: number;
	buyingFormValues: any;
};

const SellingImp = () => {
	const { moveForward, addData, data } = useFlowControl<SellingOutType>();
	const { tokenFrom } = useFlowData<SellingInType>();
	const initialValues = useMemo(
		() => ({ tokenFrom, allocation: "limited", ...data.buyingFormValues }),
		[data.buyingFormValues, tokenFrom]
	);

	const findToken = useTokenSearch();
	const web3 = useWeb3();
	const provider = useWeb3Provider();
	const { account } = useWeb3React();

	const [balance, setBalance] = useState(0);

	const tokenContract = getTokenContract(provider, findToken(tokenFrom).address);

	useEffect(() => {
		if (!isEth(findToken(tokenFrom).address)) {
			getBalance(tokenContract, account).then((b) =>
				setBalance(parseFloat(fromWei(b, findToken(tokenFrom).decimals).toFixed(6, 1)))
			);
		} else {
			getEthBalance(web3, account).then((b) =>
				setBalance(parseFloat(fromWei(b, findToken(tokenFrom).decimals).toFixed(4, 1)))
			);
		}
	}, [web3, tokenContract, account, findToken, tokenFrom]);

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
		<SellingView
			onSubmit={onSubmit}
			tokenFrom={tokenFrom}
			balance={balance}
			initialValues={initialValues}
		/>
	);
};

export const Selling = defineFlowStep<SellingInType, SellingOutType, {}>({
	Body: SellingImp,
});
