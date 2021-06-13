import { useEffect, useState } from "react";

type LocalStorageControl<T> = [read: T | undefined, write: (value: T) => void];

const valueLookup: Record<string, any> = {};
const reactiveCallbacks: Record<string, Set<(key: any) => void>> = {};

export const useLocalStorage = <T>(
	key: string,
	mapFrom: (x: string) => T = JSON.parse,
	mapTo: (x: T) => string = JSON.stringify
): LocalStorageControl<T> => {
	const readFrom = (): T | undefined => {
		if (key in valueLookup) {
			return valueLookup[key];
		}

		const value = window.localStorage.getItem(key);

		const result = value ? mapFrom(value) : undefined;
		valueLookup[key] = result;

		return result;
	};

	const [value, setValue] = useState(() => readFrom());

	useEffect(() => {
		if (!reactiveCallbacks[key]) {
			reactiveCallbacks[key] = new Set();
		}

		reactiveCallbacks[key].add(setValue);

		return () => {
			reactiveCallbacks[key].delete(setValue);
		};
	});

	return [
		value,
		(value) => {
			window.localStorage.setItem(key, mapTo(value));
			valueLookup[key] = value;
			reactiveCallbacks[key].forEach((cb) => cb(value));
		},
	];
};
