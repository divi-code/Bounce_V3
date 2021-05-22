import { toQueryArguments } from "./helpers";
import { Fetch, QueryArgs } from "./types";

const DEFAULT_HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json",
} as const;

interface JsonOptions {
	headers?: Record<string, string>;
}

const fetchJSONWithPayload = async (
	fetch: Fetch | undefined = global.fetch,
	method: "GET" | "POST" | "PUT",
	url: string,
	payload?: any,
	options: JsonOptions = {}
): Promise<Response> =>
	fetch(url, {
		method,
		headers: options.headers || DEFAULT_HEADERS,
		body: payload ? JSON.stringify(payload) : undefined,
	});

export const getJson = async <T = unknown, K extends QueryArgs = any>(
	fetch: Fetch | undefined,
	url: string,
	payload?: K,
	options?: JsonOptions
): Promise<T> =>
	(
		await fetchJSONWithPayload(
			fetch,
			"GET",
			url + (payload ? `${url.indexOf("?") >= 0 ? "&" : "?"}${toQueryArguments(payload)}` : ""),
			undefined,
			options
		)
	).json();

export const postJson = async <T = unknown, K = unknown>(
	fetch: Fetch | undefined,
	url: string,
	payload: K,
	options?: JsonOptions
): Promise<T> => (await fetchJSONWithPayload(fetch, "POST", url, payload, options)).json();

export const putJson = async <T = unknown, K = unknown>(
	fetch: Fetch,
	url: string,
	payload: K,
	options?: JsonOptions
): Promise<T> => (await fetchJSONWithPayload(fetch, "PUT", url, payload, options)).json();
