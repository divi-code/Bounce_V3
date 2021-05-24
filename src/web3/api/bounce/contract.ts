import { AbstractProvider } from "web3-core";

import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING, getChainAddressMapping } from "@app/web3/networks/mapping";

import BounceFixedSwapABI from "./BbounceFixedSwap.abi.json";

export const getAbiMapping = (target: ADDRESS_MAPPING) => {
	switch (target) {
		case ADDRESS_MAPPING.FIX_SWAP:
			return BounceFixedSwapABI.abi;
	}
};

export const getBounceContract = (
	provider: AbstractProvider,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS
) => {
	return getContract(provider, getAbiMapping(target), getChainAddressMapping(target, chainId));
};
