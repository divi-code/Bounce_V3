import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { defineFlowStep } from "@app/modules/flow/definition";

export const DutchView: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={className}>Dutch</div>;
};

export const Dutch = defineFlowStep<{}, {}, MaybeWithClassName>({
	Body: DutchView,
});
