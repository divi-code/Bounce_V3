import { WEB3_NETWORKS } from "./const";

export const defineNetworkMapper = (mapping: Record<WEB3_NETWORKS, string>) => (
	chainId: WEB3_NETWORKS
): string => mapping[chainId];
