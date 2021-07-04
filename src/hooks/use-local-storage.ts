import { useCallback, useEffect, useState } from "react";

export type LocalStorageControl<T> = [
	read: T | undefined,
	write: (value: T | ((oldValue: T) => T)) => void
];

const valueLookup: Record<string, any> = {};
const reactiveCallbacks: Record<string, Set<(key: any) => void>> = {};

export const useLocalStorage = <T>(
	key: string,
	mapFrom: (x: string) => T = JSON.parse,
	mapTo: (x: T) => string = JSON.stringify
): LocalStorageControl<T> => {
	const readFrom = useCallback((): T | undefined => {
		if (key in valueLookup) {
			return valueLookup[key];
		}

		const value = window.localStorage.getItem(key);

		const result = value ? mapFrom(value) : undefined;
		valueLookup[key] = result;

		return result;
	}, [key, mapFrom]);

	const [value, setValue] = useState(() => readFrom());

	useEffect(() => {
		if (!reactiveCallbacks[key]) {
			reactiveCallbacks[key] = new Set();
		}

		reactiveCallbacks[key].add(setValue);

		return () => {
			reactiveCallbacks[key].delete(setValue);
		};
	}, [key]);

	return [
		value,
		useCallback(
			(newValue) => {
				// @ts-ignore
				const value = typeof newValue === "function" ? newValue(readFrom()) : newValue;
				window.localStorage.setItem(key, mapTo(value));
				valueLookup[key] = value;
				reactiveCallbacks[key].forEach((cb) => cb(value));
			},
			[key, mapTo, readFrom]
		),
	];
};
