import { CreateConfirmation } from "./CreateConfirmation";

export const Default = () => {
	return (
		<div>
			<CreateConfirmation moveBack={() => alert("Back")} onComplete={() => alert("Back")}>
				Steps
			</CreateConfirmation>
		</div>
	);
};
