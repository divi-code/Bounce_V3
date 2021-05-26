export type ShortTokenListInfo = {
	key: string;
	name: string;
	img: string;
	count: number;
};

export type TokenListControl = {
	activeLists: string[];
	change(listKey: string, change: boolean): void;
};
