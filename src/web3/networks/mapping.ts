import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { defineNetworkMapper } from "./utils";

const getFixSwapAddress = defineNetworkMapper({
	[WEB3_NETWORKS.MAIN]: "0x73282A63F0e3D7e9604575420F777361ecA3C86A",
	[WEB3_NETWORKS.RINKEBY]: "0xD4c1a4733630d6df9Ff6a35bA92e27dd5645998E",
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

const getOtcAddress = defineNetworkMapper({
	[WEB3_NETWORKS.MAIN]: "0x73282A63F0e3D7e9604575420F777361ecA3C86A",
	[WEB3_NETWORKS.RINKEBY]: "0xF47c1A638a6E339990d4f06d6570Eb9D3aeFe2A5",
	[WEB3_NETWORKS.BINANCE]: "0x4Fc4bFeDc5c82644514fACF716C7F888a0C73cCc",
});

export const getOtcChainAddressMapping = (chainId: WEB3_NETWORKS) => {
	return getOtcAddress(chainId);
};
