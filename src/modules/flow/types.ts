import { ComponentType } from "react";

export interface FlowActionComponentProps {
	hasNextStep: boolean;
}

export interface FlowStepDefinition<ExtraProps extends object = {}, OutState extends object = {}> {
	Frame?: ComponentType<ExtraProps>;
	Body: ComponentType<FlowActionComponentProps & ExtraProps>;

	validate?(outData: OutState, props: ExtraProps): true | any;
}

export interface FlowStep<Tin, Tout, ExtraProps extends object>
	extends FlowStepDefinition<ExtraProps> {
	// virtual fields to kick off TypeScript checks
	requirements: Tin;
	output: Tout;
	props: ExtraProps;
}

export type FlowSubmitCallback = undefined | (() => void);
