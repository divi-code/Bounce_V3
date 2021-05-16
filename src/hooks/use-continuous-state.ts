import { useCallback, useEffect, useState } from "react";

export type ContinuousState<T> = {
	defined: boolean;
	past: T;
	present: T;
	future: T;
};

export type EmptyDelayComponent = (props: { timeout?: number }) => null;

export type ScatteredContinuousState<T> = {
	defined: boolean;
	past: T;
	present: T;
	future: T;
	DefinePresent: EmptyDelayComponent;
};

/**
 * returns 3 values, the past, present and future, representing the change of a given `value`
 * @param value - current value
 * @param timeout - the speed of change for the past (timeout between present and past)
 */
export const useContinuousState = <T>(
	value: T,
	options: {
		timeout: number | ((t: T) => number);
		initialValue?: T;
	}
): ContinuousState<T> => {
	// phased state
	const initialValue = "initialValue" in options ? options.initialValue! : value;
	const { timeout } = options;
	const [past, setPastState] = useState(initialValue);
	const [present, setPresentState] = useState(initialValue);
	const [future, setFutureState] = useState(initialValue);

	// set the future
	useEffect(() => {
		setFutureState(value);
	}, [value]);

	// remember the present
	useEffect(() => {
		setPresentState(future);
	}, [future]);

	// forget the past
	useEffect(() => {
		const tm = setTimeout(
			() => setPastState(present),
			typeof timeout === "function" ? timeout(present) : (present ? 1 : timeout) || 1
		);

		return () => clearTimeout(tm);
	}, [present, timeout]);

	return {
		defined: Boolean(past) || Boolean(present) || Boolean(future),
		past,
		present,
		future,
	};
};

export const useScatteredContinuousState = <T>(
	value: T,
	options: {
		timeout: number | ((t: T) => number);
		initialValue?: T;
	}
): ScatteredContinuousState<T> => {
	// phased state
	const initialValue = "initialValue" in options ? options.initialValue! : value;
	const { timeout } = options;
	const [past, setPastState] = useState(initialValue);
	const [present, setPresentState] = useState(initialValue);
	const [future, setFutureState] = useState(initialValue);

	// set the future
	useEffect(() => {
		setFutureState(value);
	}, [value]);

	const definePresent = useCallback(() => setPresentState(future), [setPresentState, future]);

	const DefinePresent: EmptyDelayComponent = useCallback(
		(props) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				setTimeout(() => {
					definePresent();
				}, props.timeout);
			}, [definePresent]);
			return null;
		},
		[definePresent]
	);

	// forget the past
	useEffect(() => {
		const tm = setTimeout(
			() => setPastState(present),
			typeof timeout === "function" ? timeout(present) : (present ? 1 : timeout) || 1
		);

		return () => clearTimeout(tm);
	}, [present, timeout]);

	return {
		defined: Boolean(past) || Boolean(present) || Boolean(future),
		past,
		present,
		future,
		DefinePresent,
	};
};
