import { AbstractProvider } from "web3-core";

import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING, getChainAddressMapping } from "@app/web3/networks/mapping";

import BounceABI from "./bounce.abi.json";

export const getBounceContract = (
	provider: AbstractProvider,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS
) => {
	return getContract(provider, BounceABI.abi as any, getChainAddressMapping(target, chainId));
};
