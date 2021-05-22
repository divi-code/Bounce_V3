import { AbiItem } from "web3-utils";

declare module "*.abi.json" {
	const content: {
		abi: AbiItem | AbiItem[];
	};
	export default content;
}
