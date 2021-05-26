type LocalStorageControl<T> = [read: () => T | undefined, write: (value: T) => void];

export const useLocalStorage = <T>(
	key: string,
	mapFrom: (x: string) => T = JSON.parse,
	mapTo: (x: T) => string = JSON.stringify
): LocalStorageControl<T> => {
	return [
		() => {
			const value = window.localStorage.getItem(key);

			return value ? mapFrom(value) : undefined;
		},
		(value) => {
			window.localStorage.setItem(key, mapTo(value));
		},
	];
};
