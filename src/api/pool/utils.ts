import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { defineNetworkMapper } from "@app/web3/networks/utils";

export const getAPIByNetwork = defineNetworkMapper({
	[WEB3_NETWORKS.MAIN]: "https://account.bounce.finance:16000/query_main/api",
	[WEB3_NETWORKS.RINKEBY]: "https://account.bounce.finance:16000/query_rinkeby/api",
	[WEB3_NETWORKS.BINANCE]: "https://account.bounce.finance:16000/query_bsc/api",
});
