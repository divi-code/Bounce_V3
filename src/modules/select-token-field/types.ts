export type ShortTokenListInfo = {
	key: string;
	name: string;
	img: string;
	count: number;
};

export type ShortTokenInfo = {
	key: string;
	title: string;
	currency: string;
	img: string | undefined;
	source: string;
};

export type TokenListControl = {
	activeLists: string[];
	change(listKey: string, change: boolean): void;
};
