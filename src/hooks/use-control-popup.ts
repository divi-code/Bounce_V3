import { ScatteredContinuousState, useScatteredContinuousState } from "./use-continuous-state";
import { useCallback, useState } from "react";

export const useControlPopUp = (): {
	popUp: ScatteredContinuousState<boolean>;
	open(): void;
	close(): void;
	toggle(): void;
} => {
	const [popUpVisible, setPopUpVisible] = useState(false);
	const popUp = useScatteredContinuousState(popUpVisible, {
		timeout: 350,
	});
	const open = useCallback(() => setPopUpVisible(true), []);
	const close = useCallback(() => setPopUpVisible(false), []);
	const toggle = useCallback(() => setPopUpVisible((visible) => !visible), []);

	return {
		popUp,
		open,
		close,
		toggle,
	};
};
