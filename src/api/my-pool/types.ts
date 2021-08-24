import { WEB3_NETWORKS } from "@app/web3/networks/const";

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
