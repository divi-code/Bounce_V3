import { DependencyList, useCallback, useState } from "react";

type Callback = () => void;

const useDeferredCallback = <T extends (...args: any[]) => void>(
	callback: T,
	deps: DependencyList
): T =>
	useCallback(
		((...args: any[]) => {
			setTimeout(callback, 1, ...args);
		}) as T,
		deps
	);

export const useFocusTracker = (): [boolean, Callback, Callback] => {
	const [focused, setFocused] = useState(0);

	const onFocus = useCallback(() => setFocused((counter) => counter + 1), []);
	const onBlur = useDeferredCallback(() => setFocused((counter) => counter - 1), []);

	return [focused > 0, onFocus, onBlur];
};

export const useOpenControl = (): [boolean, Callback, Callback, Callback] => {
	const [on, setOn] = useState(false);

	const toggle = useCallback(() => setOn(!on), [on]);
	const open = useCallback(() => {
		setOn(true);
	}, []);
	const close = useCallback(() => {
		setOn(false);
	}, []);

	return [on, open, close, toggle];
};

export const useDeferredOpenControl = (): [boolean, Callback, Callback, Callback] => {
	const [on, setOn] = useState(false);

	const toggle = useDeferredCallback(() => setOn(!on), [on]);
	const open = useDeferredCallback(() => {
		setOn(true);
	}, []);
	const close = useDeferredCallback(() => {
		setOn(false);
	}, []);

	return [on, open, close, toggle];
};
