import { ProvideAdvancedSettings } from "./ProvideAdvancedSettings";

export const Default = () => {
	return (
		<div>
			<ProvideAdvancedSettings onSubmit={() => alert("Submit")} />
		</div>
	);
};
