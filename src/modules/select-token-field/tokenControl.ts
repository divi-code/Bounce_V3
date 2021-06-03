import { useLocalStorage } from "@app/hooks/use-local-storage";

import { TokenListControl } from "./types";

const EMPTY_ARRAY = [];

export const useTokenListControl = (): TokenListControl => {
	const [list = EMPTY_ARRAY, write] = useLocalStorage<string[]>("used-token-lists");

	return {
		activeLists: list,
		change: (name, flag) => {
			write(flag ? [...list, name] : list.filter((x) => x !== name));
		},
	};
};
