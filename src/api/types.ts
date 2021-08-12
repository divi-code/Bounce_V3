import { TokenInfo } from "@uniswap/token-lists";

export interface IToken extends TokenInfo {
	name: string;
	address: string;
	symbol: string;
	decimals: number;
	coinGeckoID?: string;
	currentPrice?: number;
	largeURL?: string;
	smallURL?: string;
	thumbURL?: string;
}
