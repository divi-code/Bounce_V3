import { WEB3_NETWORKS } from "@app/web3/networks/const";

// export type IPoolSearchEntity = {
// 	amountTotal0: string;
// 	amountTotal1: string;
// 	auctionType: number;
// 	auctioneer: string;
// 	businessType: number;
// 	category: number;
// 	openAt: number;
// 	closeAt: number;
// 	claimAt: number;
// 	contract: string;
// 	contractHeight: number;
// 	contractTxHash: string;
// 	creator: string;
// 	id: number;
// 	name: string;
// 	poolID: string;
// 	status: number;
// 	swappedAmount0: string;
// 	token0: string;
// 	token1: string;
// };

export interface IPoolSearchProps {
	chainId: WEB3_NETWORKS;
	address: string;
	poolType: "created" | "participated";
	pagination: {
		page: number;
		perPage: number;
	};
	status?: string;
}
