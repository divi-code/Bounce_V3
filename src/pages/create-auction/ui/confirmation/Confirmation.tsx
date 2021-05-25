import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { defineFlowStep } from "@app/modules/flow/definition";

export const ConfirmationView: FC<MaybeWithClassName> = ({ className }) => {
	return <div className={className}>Confirmation</div>;
};

export const Confirmation = defineFlowStep<{}, {}, MaybeWithClassName>({
	Body: ConfirmationView,
});
