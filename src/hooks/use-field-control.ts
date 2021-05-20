import { useCallback, useState } from "react";

type Callback = () => void;

export const useFocusTracker = (): [boolean, Callback, Callback] => {
	const [focused, setFocused] = useState(0);

	const onFocus = useCallback(() => setFocused((counter) => counter + 1), []);
	const onBlur = useCallback(() => setImmediate(() => setFocused((counter) => counter - 1)), []);

	return [focused > 0, onFocus, onBlur];
};

export const useOpenControl = (): [boolean, Callback, Callback, Callback] => {
	const [on, setOn] = useState(false);

	const toggle = useCallback(() => setOn((wasOn) => !wasOn), []);
	const open = useCallback(() => {
		setOn(true);
	}, []);
	const close = useCallback(() => {
		setOn(false);
	}, []);

	return [on, open, close, toggle];
};
