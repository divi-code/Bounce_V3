import { AbstractProvider } from "web3-core";

import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { ADDRESS_MAPPING, getChainAddressMapping } from "@app/web3/networks/mapping";

import BounceERC20ABI from "./BounceERC20.abi.json";
import BounceFixedSwapABI from "./BounceFixedSwap.abi.json";

import type { Contract as ContractType } from "web3-eth-contract";

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

export const getTokenContract = (provider: AbstractProvider, token: string) => {
	return getContract(provider, BounceERC20ABI.abi, token);
};

export const approveAuctionPool = async (
	contract: ContractType,
	target: ADDRESS_MAPPING,
	chainId: WEB3_NETWORKS,
	account: string,
	amount: string
) => {
	console.log({
		amount,
	});

	return contract.methods
		.approve(getChainAddressMapping(target, chainId), amount)
		.send({ from: account });
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

export const createAuctionPool = (
	contract: ContractType,
	account: string,
	data: AuctionPoolType,
	whiteList?: string[]
) => {
	console.log("sending", data);

	return contract.methods.create(data, whiteList || []).send({ from: account });
};

export const getBalance = async (contract: ContractType, account: string) => {
	return contract.methods.balanceOf(account).call();
};

export const getPools = async (contract: ContractType, poolID: number) => {
	return contract.methods.pools(poolID).call();
};
