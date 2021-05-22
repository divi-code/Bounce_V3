import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { defineNetworkMapper } from "./utils";

const getFixSwapAddress = defineNetworkMapper({
	[WEB3_NETWORKS.MAIN]: "0x73282A63F0e3D7e9604575420F777361ecA3C86A",
	[WEB3_NETWORKS.RINKEBY]: "0x4392E75b5f44f1943f4bA8BE9fa6e14931F0630d",
	[WEB3_NETWORKS.BINANCE]: "0x4Fc4bFeDc5c82644514fACF716C7F888a0C73cCc",
});

export enum ADDRESS_MAPPING {
	FIX_SWAP,
}

export const getChainAddressMapping = (target: ADDRESS_MAPPING, chainId: WEB3_NETWORKS) => {
	switch (target) {
		case ADDRESS_MAPPING.FIX_SWAP:
			return getFixSwapAddress(chainId);
	}
};
