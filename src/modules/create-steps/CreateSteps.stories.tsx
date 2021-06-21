import { CreateSteps } from "./CreateSteps";

export const Default = () => {
	return (
		<div>
			<CreateSteps
				count={2}
				currentStep={1}
				moveToStep={() => alert("Back")}
				moveForward={() => alert("Back")}
				type="Sell OTC"
				title="Advanced Setting"
			>
				Steps
			</CreateSteps>
		</div>
	);
};
