import React, { FC } from "react";

import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { PopUpContainer } from "@app/ui/pop-up-container";

interface IStakePopUpProps {
	popUp: ScatteredContinuousState<boolean>;
	onClose(): void;
}

export const StakePopUp: FC<IStakePopUpProps> = ({ popUp, onClose, children }) => {
	return (
		<PopUpContainer
			animated={popUp.present}
			visible={popUp.defined}
			onClose={onClose}
			maxWidth={640}
			withoutClose={false}
		>
			{children}
			<popUp.DefinePresent />
		</PopUpContainer>
	);
};
