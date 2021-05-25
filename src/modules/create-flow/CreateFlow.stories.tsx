import { defineFlow, defineFlowStep } from "@app/modules/flow/definition";

import { CreateFlow } from "./CreateFlow";

const Step1View = () => <div>Step1</div>;

const Step1 = defineFlowStep<{}, {}, {}>({
	Body: Step1View,
});

const Step2View = () => <div>Step2</div>;

const Step2 = defineFlowStep<{}, {}, {}>({
	Body: Step2View,
});

const Step3View = () => <div>Confirm</div>;

const Step3 = defineFlowStep<{}, {}, {}>({
	Body: Step3View,
});

const STEPS = defineFlow(Step1, Step2, Step3);

export const Default = () => {
	return (
		<div>
			<CreateFlow steps={STEPS} onComplete={() => alert("Confirm")} type="Sell OTC" />
		</div>
	);
};
