import { FlowStep, FlowStepDefinition } from "./types";

type Missing<X extends keyof any> = {
	[k in X]: never;
};

type FlowRequirements<Given extends object, Required extends object> = Given extends Required
	? Required
	: Missing<Exclude<keyof Required, keyof Given>>;

/**
 * defines FlowSteps
 * @param step1
 * @param step2
 * @param step3
 */
export function defineFlow<
	FlowProps1 extends object,
	in1 extends object,
	out1 extends object,
	FlowProps2 extends {},
	in2 extends object,
	out2 extends object,
	FlowProps3 extends {},
	in3 extends object,
	out3 extends object,
	FlowProps4 extends {},
	in4 extends object,
	out4 extends object,
	FlowProps5 extends {},
	in5 extends object,
	out5 extends object,
	FlowProps6 extends {},
	in6 extends object,
	out6 extends object
>(
	_step1: FlowStep<FlowRequirements<{}, in1>, out1, FlowProps1>,
	_step2?: FlowStep<FlowRequirements<out1, in2>, out2, FlowProps2>,
	_step3?: FlowStep<FlowRequirements<out1 & out2, in3>, out3, FlowProps3>,
	_step4?: FlowStep<FlowRequirements<out1 & out2 & out3, in4>, out4, FlowProps4>,
	_step5?: FlowStep<FlowRequirements<out1 & out2 & out3 & out4, in5>, out5, FlowProps5>,
	_step6?: FlowStep<FlowRequirements<out1 & out2 & out3 & out4 & out5, in6>, out6, FlowProps6>
): Array<
	FlowStep<{}, {}, FlowProps1 & FlowProps2 & FlowProps3 & FlowProps4 & FlowProps5 & FlowProps6>
> {
	// eslint-disable-next-line prefer-rest-params
	return Array.from(arguments);
}

export const defineFlowStep = <
	Tin extends object,
	Tout extends object,
	ComponentProps extends object = {}
>(
	data: FlowStepDefinition<ComponentProps, Tout & Tin>
): FlowStep<Tin, Tout, ComponentProps> => data as any;
