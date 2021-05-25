import { ProvideTokenInformation } from "./ProvideTokenInformation";

export const Default = () => {
	return (
		<div>
			<ProvideTokenInformation
				onSubmit={() => alert("Submit")}
				onTokenChange={() => alert("Change")}
			/>
		</div>
	);
};
