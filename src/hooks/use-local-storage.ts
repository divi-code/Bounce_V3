import { useEffect, useState } from "react";

type LocalStorageControl<T> = [read: T | undefined, write: (value: T) => void];

const reactiveCallbacks: Record<string, Set<(key: any) => void>> = {};

export const useLocalStorage = <T>(
	key: string,
	mapFrom: (x: string) => T = JSON.parse,
	mapTo: (x: T) => string = JSON.stringify
): LocalStorageControl<T> => {
	const readFrom = (): T | undefined => {
		const value = window.localStorage.getItem(key);

		return value ? mapFrom(value) : undefined;
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
			reactiveCallbacks[key].forEach((cb) => cb(value));
		},
	];
};
