import { useEffect } from "react";

export const FOCUS_RINGS_DATA_ATTRIBUTE = "data-focus-rings" as const;

const enableRings = (event: KeyboardEvent) => {
	if (event.key === "Tab" || (event.key && event.key.startsWith("Arrow"))) {
		document!.body.setAttribute(FOCUS_RINGS_DATA_ATTRIBUTE, "true");
	}
};

const disableRings = () => document!.body.removeAttribute(FOCUS_RINGS_DATA_ATTRIBUTE);

export const useFocusRings = () => {
	useEffect(() => {
		window!.addEventListener("keydown", enableRings);
		window!.addEventListener("mousemove", disableRings);

		return () => {
			window!.removeEventListener("keydown", enableRings);
			window!.removeEventListener("mousemove", disableRings);
		};
	}, []);
};
