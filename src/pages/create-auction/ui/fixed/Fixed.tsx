import { useState } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl, useFlowData } from "@app/modules/flow/hooks";

import { ALLOCATION_TYPE, FixedView } from "./FixedView";

type FixedInType = {
	tokenFrom: string;
};

export type FixedOutType = {
	tokenTo: string;
	swapRatio: string;
	amount: string;
	allocation: ALLOCATION_TYPE;
	limit: string;
};

const FixedImp = () => {
	const { moveForward, addData } = useFlowControl<FixedOutType>();
	const { tokenFrom } = useFlowData<FixedInType>();

	const onSubmit = async (values: any) => {
		addData({
			tokenTo: values.tokenTo,
			swapRatio: values.swapRatio,
			amount: values.amount,
			allocation: values.allocation,
			limit: values.limit ? values.limit : "",
		});

		moveForward();
	};

	const [balance, setBalance] = useState("0");

	return <FixedView onSubmit={onSubmit} tokenFrom={tokenFrom} balance={balance} />;
};

export const Fixed = defineFlowStep<FixedInType, FixedOutType, {}>({
	Body: FixedImp,
});
