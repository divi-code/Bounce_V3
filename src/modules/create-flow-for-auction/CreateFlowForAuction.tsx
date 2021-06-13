import { FC, ReactNode } from "react";

import React from "react";
import { uid } from "react-uid";

import { POOL_NAME_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { CreateConfirmation } from "@app/modules/create-confirmation";
import { CreateSteps } from "@app/modules/create-steps";
import { Flow } from "@app/modules/flow";

import styles from "./CreateFlowForAuction.module.scss";

type CreateFlowType = {
	type: POOL_TYPE;
	alert?: ReactNode;
	steps: any;
	onComplete(data: unknown): void;
};

const CAPTIONS = {
	0: "Token Information",
	1: "Auction Parameters",
	2: "Advanced Setting",
};

export const CreateFlowForAuction: FC<CreateFlowType & MaybeWithClassName> = ({
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
								type={POOL_NAME_MAPPING[type]}
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
