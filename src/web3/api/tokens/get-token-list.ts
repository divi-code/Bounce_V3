import { TokenList, schema } from "@uniswap/token-lists";
import Ajv from "ajv";

import { contenthashToUri } from "./ens/contentHashToUrl";
import { uriToHttp } from "./ens/helpers";
import { parseENSAddress } from "./ens/matcher";

const tokenListValidator = new Ajv({ allErrors: true }).compile(schema);

const getTokenUrls = async (
	listUrl: string,
	resolveENSContentHash: (ensName: string) => Promise<string>
): Promise<string[]> => {
	const parsedENS = parseENSAddress(listUrl);

	if (!parsedENS) {
		return uriToHttp(listUrl);
	}

	let contentHashUri;

	try {
		contentHashUri = await resolveENSContentHash(parsedENS.ensName);
	} catch (error) {
		console.debug(`Failed to resolve ENS name: ${parsedENS.ensName}`, error);
		throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`);
	}

	let translatedUri;

	try {
		translatedUri = contenthashToUri(contentHashUri);
	} catch (error) {
		console.debug("Failed to translate contenthash to URI", contentHashUri);
		throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`);
	}

	return uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ""}`);
};

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export default async function getTokenList(
	listUrl: string,
	resolveENSContentHash: (ensName: string) => Promise<string>
): Promise<TokenList> {
	const urls = await getTokenUrls(listUrl, resolveENSContentHash);

	for (let i = 0; i < urls.length; i++) {
		const url = urls[i];
		const isLast = i === urls.length - 1;
		let response;

		try {
			response = await fetch(url, { credentials: "omit" });
		} catch (error) {
			console.debug("Failed to fetch list", listUrl, error);
			if (isLast) throw new Error(`Failed to download list ${listUrl}`);
			continue;
		}

		if (!response.ok) {
			if (isLast) throw new Error(`Failed to download list ${listUrl}`);
			continue;
		}

		const json = await response.json();

		if (!tokenListValidator(json)) {
			const validationErrors: string =
				tokenListValidator.errors?.reduce<string>((memo, error) => {
					const add = `${error.dataPath} ${error.message ?? ""}`;

					return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
				}, "") ?? "unknown error";
			throw new Error(`Token list failed validation: ${validationErrors}`);
		}

		return json;
	}

	throw new Error("Unrecognized list URL protocol.");
}
