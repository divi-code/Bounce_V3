import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { defineFlowStep } from "@app/modules/flow/definition";

export const EnglishView: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={className}>English</div>;
};

export const English = defineFlowStep<{}, {}, MaybeWithClassName>({
	Body: EnglishView,
});
