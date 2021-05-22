export type Fetch = (input: string, init: RequestInit) => Promise<Response>;

export type QueryArgs = {
	[k: string]: string | number | boolean;
};

export type PostArgs = {
	[k: string]: string | string[] | number | boolean | undefined;
};

export type NetworkCall = {
	url: string;
	query: QueryArgs;
};
