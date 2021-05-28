import Web3 from "web3";
import { AbstractProvider } from "web3-core";
import { Contract } from "web3-eth-contract";

export function getContract(provider: AbstractProvider, abi: any, address: string): Contract {
	const web3 = new Web3(provider);

	return new web3.eth.Contract(abi, address);
}
