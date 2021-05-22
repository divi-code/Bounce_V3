import type { QueryArgs } from "./types";

export const toQueryArguments = (args: QueryArgs): string =>
	Object.keys(args)
		.reduce((acc, key) => {
			const keyValue = args[key];

			if (keyValue) {
				acc.push(`${key}=${encodeURIComponent(keyValue)}`);
			} else {
				acc.push(key);
			}

			return acc;
		}, [] as string[])
		.join("&");
