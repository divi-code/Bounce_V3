import { AbstractProvider } from "web3-core";

import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { getOtcChainAddressMapping } from "@app/web3/networks/mapping";

import BounceOTCABI from "./BounceOTC.abi.json";

import type { Contract as ContractType } from "web3-eth-contract";

export const getBounceOtcContract = (provider: AbstractProvider, chainId: WEB3_NETWORKS) => {
	return getContract(provider, BounceOTCABI.abi, getOtcChainAddressMapping(chainId));
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
	token0: string;
	token1: string;
	amountTotal0: string;
	amountTotal1: string;
	openAt: number;
	enableWhiteList: boolean;
	onlyBot: boolean;
	poolType: 0 | 1;
	creator: string;
};

export const createOtcPool = (
	contract: ContractType,
	account: string,
	data: OtcPoolType,
	whiteList: string[] | undefined
) => {
	const action = contract.methods.create(data, whiteList !== undefined ? whiteList : []);

	action.estimateGas();

	console.log("send", data);

	return action.send({ from: account });
};

export const getOtcPools = async (
	contract: ContractType,
	poolID: number
): Promise<Omit<OtcPoolType, "onlyBot">> => {
	return contract.methods.pools(poolID).call();
};

export const getSwap1Amount = async (contract: ContractType, poolID: number) => {
	return contract.methods.amountSwap1P(poolID).call();
};

export const getWhitelistedStatus = async (
	contract: ContractType,
	poolID: number,
	address: string
): Promise<boolean> => {
	return contract.methods.whitelistP(poolID, address).call();
};

export const swapContracts = (
	contract: ContractType,
	amount: string,
	account: string,
	poolID: number,
	sendAmount: string
) => {
	const action = contract.methods.swap(poolID, amount);

	action.estimateGas({
		poolID,
		amount,
	});

	return action.send({ from: account, value: sendAmount });
};

export const getMyAmount0 = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<string> => {
	return contract.methods.myAmountSwapped0(address, poolID).call();
};

export const getMyAmount1 = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<string> => {
	return contract.methods.myAmountSwapped1(address, poolID).call();
};

export const delList = (contract: ContractType, account: string, poolID: number) => {
	const action = contract.methods.deList(poolID);

	action.estimateGas({
		poolID,
	});

	return action.send({ from: account });
};
