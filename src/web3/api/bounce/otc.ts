import { AbstractProvider } from "web3-core";

import { AuctionPoolType } from "@app/web3/api/bounce/pool";
import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { getOtcChainAddressMapping } from "@app/web3/networks/mapping";

import BounceOTCABI from "./BounceFixedSwap.abi.json";

import type { Contract as ContractType } from "web3-eth-contract";

export const ABI = BounceOTCABI.abi;

export const getBounceOtcContract = (provider: AbstractProvider, chainId: WEB3_NETWORKS) => {
	return getContract(provider, ABI, getOtcChainAddressMapping(chainId));
};

export const approveOtcPool = async (
	contract: ContractType,
	chainId: WEB3_NETWORKS,
	account: string,
	amount: string
) => {
	return contract.methods
		.approve(getOtcChainAddressMapping(chainId), amount)
		.send({ from: account });
};

export const getOtcAllowance = async (
	contract: ContractType,
	chainId: WEB3_NETWORKS,
	account: string
) => {
	return contract.methods.allowance(account, getOtcChainAddressMapping(chainId)).call();
};

export type OtcPoolType = {
	name: string;
	creator: string;
	token0: string;
	token1: string;
	amountTotal0: string;
	amountTotal1: string;
	openAt: number;
	enableWhiteList: boolean;
	onlyBot: boolean;
};

export const createOtcPool = (
	contract: ContractType,
	account: string,
	data: OtcPoolType,
	whiteList: string[] | undefined
) => {
	const action = contract.methods.create(data, whiteList !== undefined ? whiteList : []);

	action.estimateGas();

	return action.send({ from: account });
};
