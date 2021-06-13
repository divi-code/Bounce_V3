import { FC, ReactNode } from "react";

import React from "react";
import { uid } from "react-uid";

import { OTC_CREATE_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { CreateConfirmation } from "@app/modules/create-confirmation";
import { CreateSteps } from "@app/modules/create-steps";
import { Flow } from "@app/modules/flow";

import styles from "./CreateFlowForOtc.module.scss";

type CreateFlowType = {
	type: OTC_TYPE;
	alert?: ReactNode;
	steps: any;
	onComplete(data: unknown): void;
};

const CAPTIONS = {
	0: "Token Information",
	1: "OTC Parameters",
	2: "Advanced Setting",
};

export const CreateFlowForOtc: FC<CreateFlowType & MaybeWithClassName> = ({
	steps,
	type,
	alert,
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
								type={OTC_CREATE_NAME_MAPPING[type]}
								currentStep={currentStep}
								moveForward={moveForward}
								moveBack={moveBack}
							>
								{body}
							</CreateSteps>
						) : (
							<CreateConfirmation onComplete={moveForward} alert={alert} moveBack={moveBack}>
								{body}
							</CreateConfirmation>
						)}
					</>
				);
			}}
		</Flow>
	);
};
