import { AbstractProvider } from "web3-core";

import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING, getChainAddressMapping } from "@app/web3/networks/mapping";

import BounceFixedSwapABI from "./BounceFixedSwap.abi.json";

import type { Contract as ContractType } from "web3-eth-contract";

export const getAbiMapping = (target: ADDRESS_MAPPING) => {
	switch (target) {
		case ADDRESS_MAPPING.FIX_SWAP:
			return BounceFixedSwapABI.abi;
	}
};

export const getBouncePoolContract = (
	provider: AbstractProvider,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS
) => {
	return getContract(provider, getAbiMapping(target), getChainAddressMapping(target, chainId));
};

export const approveAuctionPool = async (
	contract: ContractType,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS,
	account: string,
	amount: string
) => {
	return contract.methods
		.approve(getChainAddressMapping(target, chainId), amount)
		.send({ from: account });
};

export const getAllowance = async (
	contract: ContractType,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS,
	account: string
) => {
	return contract.methods.allowance(account, getChainAddressMapping(target, chainId)).call();
};

export type AuctionPoolType = {
	name: string;
	creator: string;
	token0: string;
	token1: string;
	amountTotal0: string;
	amountTotal1: string;
	openAt: number;
	closeAt: number;
	claimAt: number;
	enableWhiteList: boolean;
	maxAmount1PerWallet: string;
	onlyBot: boolean;
};

export const getPools = async (
	contract: ContractType,
	poolID: number
): Promise<Omit<AuctionPoolType, "maxAmount1PerWallet" | "onlyBot">> => {
	return contract.methods.pools(poolID).call();
};

export const getSwap0Amount = async (contract: ContractType, poolID: number) => {
	return contract.methods.amountSwap0P(poolID).call();
};

export const getSwap1Amount = async (contract: ContractType, poolID: number) => {
	return contract.methods.amountSwap1P(poolID).call();
};

export const getLimitAmount = async (contract: ContractType, poolID: number): Promise<string> => {
	return contract.methods.maxAmount1PerWalletP(poolID).call();
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

export const getMyClaimed = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<boolean> => {
	return contract.methods.myClaimed(address, poolID).call();
};

export const getCreatorClaimed = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<boolean> => {
	return contract.methods.creatorClaimed(address, poolID).call();
};

export const getWhitelistedStatus = async (
	contract: ContractType,
	poolID: number,
	address: string
): Promise<boolean> => {
	return contract.methods.whitelistP(poolID, address).call();
};

export const createAuctionPool = (
	contract: ContractType,
	account: string,
	data: AuctionPoolType,
	whiteList: string[] | undefined
) => {
	const action = contract.methods.create(data, whiteList !== undefined ? whiteList : []);

	action.estimateGas();

	return action.send({ from: account });
};

export const swapContracts = async (
	contract: ContractType,
	amount: string,
	account: string,
	index: number
) => {
	const action = contract.methods.swap(index, amount);

	action.estimateGas();

	return action.send({ from: account, value: amount });
};

export const creatorClaim = async (contract: ContractType, account: string, index: number) => {
	const action = contract.methods.creatorClaim(index);

	action.estimateGas();

	return action.send({ from: account });
};

export const userClaim = async (contract: ContractType, account: string, index: number) => {
	const action = contract.methods.userClaim(index);

	action.estimateGas();

	return action.send({ from: account });
};
