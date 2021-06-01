import { PopUpContainer } from "@app/ui/pop-up-container";

import { Content } from "./WhiteListPopUp";

const nothing = () => null;

export const Default = () => {
	return (
		<div>
			<PopUpContainer
				animated={true}
				visible={true}
				onClose={nothing}
				maxWidth={640}
				scrollable={false}
				withoutClose
				title="Import whitelist"
			>
				<Content />
			</PopUpContainer>
		</div>
	);
};
