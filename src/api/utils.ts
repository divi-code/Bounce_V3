import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { defineNetworkMapper } from "@app/web3/networks/utils";

export const getAPIByNetwork = defineNetworkMapper({
	[WEB3_NETWORKS.MAIN]: "https://api-bcf-3.bounce.finance/v3/main",
	[WEB3_NETWORKS.RINKEBY]: "https://api-bcf-3.bounce.finance/v3/rinkeby",
	[WEB3_NETWORKS.BINANCE]: "https://api-bcf-3.bounce.finance/v3/bsc",
});
