import { FC } from "react";

import React from "react";
import { uid } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";
import { CreateConfirmation } from "@app/modules/create-confirmation";
import { CreateSteps } from "@app/modules/create-steps";
import { Flow } from "@app/modules/flow";

import styles from "./CreateFlow.module.scss";

type CreateFlowType = {
	type: string;
	steps: any;
	onComplete(data: unknown): void;
};

const CAPTIONS = {
	0: "Token Information",
	1: "Auction Parameters",
	2: "Advanced Setting",
};

export const CreateFlow: FC<CreateFlowType & MaybeWithClassName> = ({
	steps,
	type,
	onComplete,
}) => {
	return (
		<Flow
			key={uid(steps)}
			steps={steps}
			onComplete={onComplete}
			className={styles.step}
			innerClassName={styles.innerStep}
			type={type}
		>
			{(body, { currentStep, isLastStep, moveBack, moveForward }) => {
				return (
					<>
						{!isLastStep ? (
							<CreateSteps
								title={CAPTIONS[currentStep]}
								count={steps.length - 1}
								type={type}
								currentStep={currentStep}
								moveForward={moveForward}
								moveBack={moveBack}
							>
								{body}
							</CreateSteps>
						) : (
							<CreateConfirmation onComplete={moveForward} moveBack={moveBack}>
								{body}
							</CreateConfirmation>
						)}
					</>
				);
			}}
		</Flow>
	);
};
