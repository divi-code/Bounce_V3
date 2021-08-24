import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { defineNetworkMapper } from "./utils";

const getFixSwapAddress = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "0x430464cf07Ab9cF4c1c9907d518E1f45E3B80409",
	[WEB3_NETWORKS.RINKEBY]: "0xD4c1a4733630d6df9Ff6a35bA92e27dd5645998E",
	[WEB3_NETWORKS.BINANCE]: "0x50809bA1Cac76e9C73F5C0c77bB7AfeB03Ac1600",
});

const getOtcAddress = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "0x4EB49d9AF90eaF6E802614Ea2514A1c461E4e6D9",
	[WEB3_NETWORKS.RINKEBY]: "0xF47c1A638a6E339990d4f06d6570Eb9D3aeFe2A5",
	[WEB3_NETWORKS.BINANCE]: "0x959A59eeAe43cc67e73b3265994E6de1ebF3E46c",
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

export const getOtcChainAddressMapping = (chainId: WEB3_NETWORKS) => {
	return getOtcAddress(chainId);
};
