import { useLocalStorage } from "@app/hooks/use-local-storage";

import { TokenListControl } from "./types";

export const useTokenListControl = (): TokenListControl => {
	const [list, write] = useLocalStorage<string[]>("used-token-lists");

	return {
		activeLists: list,
		change: (name, flag) => {
			write(flag ? [...list, name] : list.filter((x) => x !== name));
		},
	};
};
