import { useCallback, useMemo, useState } from "react";

import { ScatteredContinuousState, useScatteredContinuousState } from "./use-continuous-state";

export type PopupControlType = {
	popUp: ScatteredContinuousState<boolean>;
	open(): void;
	close(): void;
	toggle(): void;
};

export const useControlPopUp = (): PopupControlType => {
	const [popUpVisible, setPopUpVisible] = useState(false);
	const popUp = useScatteredContinuousState(popUpVisible, {
		timeout: 350,
	});
	const open = useCallback(() => setPopUpVisible(true), []);
	const close = useCallback(() => setPopUpVisible(false), []);
	const toggle = useCallback(() => setPopUpVisible((visible) => !visible), []);

	return useMemo(
		() => ({
			popUp,
			open,
			close,
			toggle,
		}),
		[close, open, popUp, toggle]
	);
};
