import React from "react";

import { FlowStep, FlowSubmitCallback } from "./types";

export interface FlowControl<T extends object = any> {
	steps: FlowStep<any, any, any>[];
	currentStepRef: FlowStep<any, any, any>;
	currentStep: number;
	isLastStep: boolean;
	data: any;
	validationStatus: any;

	addData(data: Partial<T>): void;

	moveForward(): void;
	moveBack(): void;
	moveToStep(step: number): void;

	onMoveForward(cb: FlowSubmitCallback): void;
}

export const FlowContext = React.createContext<FlowControl>(null as any);
