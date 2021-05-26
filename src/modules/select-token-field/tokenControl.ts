import { useEffect, useState } from "react";

import { useLocalStorage } from "@app/hooks/use-local-storage";

import { TokenListControl } from "./types";

export const useTokenListControl = (): TokenListControl => {
	const [read, write] = useLocalStorage<string[]>("used-token-lists");
	const [list, setList] = useState<string[]>(read() || []);

	useEffect(() => {
		write(list);
	}, [list, write]);

	return {
		activeLists: list,
		change: (name, flag) => {
			setList(flag ? [...list, name] : list.filter((x) => x !== name));
		},
	};
};
