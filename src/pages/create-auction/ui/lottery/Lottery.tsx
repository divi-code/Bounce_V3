import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { defineFlowStep } from "@app/modules/flow/definition";

export const LotteryView: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={className}>Lottery</div>;
};

export const Lottery = defineFlowStep<{}, {}, MaybeWithClassName>({
	Body: LotteryView,
});
