import Web3 from "web3";
import { AbstractProvider } from "web3-core";

import { Contract as ContractType } from "web3-eth-contract";

import BounceERC20ABI from "@app/web3/api/bounce/BounceERC20.abi.json";
import { getContract } from "@app/web3/contracts/helpers";

export const getTokenContract = (provider: AbstractProvider, token: string) => {
	return getContract(provider, BounceERC20ABI.abi, token);
};

export const getBalance = async (contract: ContractType, account: string) => {
	return contract.methods.balanceOf(account).call();
};

export const getEthBalance = (web3: Web3, address: string): Promise<string> => {
	return web3.eth.getBalance(address);
};
