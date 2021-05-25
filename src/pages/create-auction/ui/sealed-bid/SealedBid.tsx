import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { defineFlowStep } from "@app/modules/flow/definition";

export const SealedBidView: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={className}>SealedBid</div>;
};

export const SealedBid = defineFlowStep<{}, {}, MaybeWithClassName>({
	Body: SealedBidView,
});
