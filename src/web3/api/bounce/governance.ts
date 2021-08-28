import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import Web3 from "web3";

import { IProposal, PROPOSAL_STATUS } from "@app/utils/governance";

import bounceERC20 from "./BounceERC20.abi.json";
import bounceStake from "./BounceStake.abi.json";

const { fromAscii, soliditySha3, asciiToHex, numberToHex } = Web3.utils;

const getBotAddress = (chainId) => {
	switch (chainId) {
		case 1:
			return "0x5bEaBAEBB3146685Dd74176f68a0721F91297D37";
		case 4:
			return "0xAbF690E2EbC6690c4Fdc303fc3eE0FBFEb1818eD";
		case 56:
			return "0x48DC0190dF5ece990c649A7A07bA19D3650a9572";
		default:
			return "0x5bEaBAEBB3146685Dd74176f68a0721F91297D37";
	}
};

export const getStakingAddress = (chainId) => {
	switch (chainId) {
		case 1:
			return "0x98945BC69A554F8b129b09aC8AfDc2cc2431c48E";
		case 4:
			return "0xa77A9FcbA2Ae5599e0054369d1655D186020ECE1";
		// case 4:
		//     return '0x4911C30A885EfcdD51B351B1810b1FEA73796338'
		default:
			return "0x98945BC69A554F8b129b09aC8AfDc2cc2431c48E";
	}
};

export const int2hex = (num, width) => {
	num = numberToHex(num);
	num = num.slice(2);

	let delta = width - num.length;
	let padding = "";

	while (delta-- > 0) {
		padding += "0";
	}

	return "0x" + padding + num;
};

export const getContract = (library, abi, address) => {
	const web3 = new Web3(library.provider);

	return new web3.eth.Contract(abi, address);
};

const governanceKeyMap = [
	{
		key: soliditySha3("proposer"),
		name: "creator",
	},
	{
		key: soliditySha3("proposeSubject"),
		name: "title",
		beString: true,
	},
	{
		key: soliditySha3("proposeContent"),
		name: "content",
		beString: true,
		isJson: true,
	},
	{
		key: soliditySha3("timePropose"),
		name: "time",
	},
	{
		key: soliditySha3("proposeStatus"),
		name: "voteResult",
		isByte: true,
	},
];

const queryGovernanceData = async (contract, item, id) => {
	try {
		let data;

		if (item.beString) {
			data = await contract.methods.getConfigString(item.key, id).call();
		} else {
			data = await contract.methods.getConfig(item.key, id).call();
		}

		if (item.isJson) {
			data = JSON.parse(data);
		}

		if (item.isByte) {
			data = Web3.utils.toAscii(Web3.utils.numberToHex(data));
		}

		return data;
	} catch (e) {
		console.log(e);
	}
};

const queryGovernanceItem = async (contract, _index) => {
	const info = await Promise.all(
		governanceKeyMap.map(async (item) => {
			const boj = {};
			console.log("queryGovernanceItem key", item.key);

			const data = await queryGovernanceData(contract, item, _index);
			console.log("queryGovernanceItem data:", data);
			boj[item.name] = data;

			return boj;
		})
	);

	console.log("info: ", info);

	const data: IProposal = {};

	data.index = _index;

	for (let i = 0; i < info.length; i++) {
		const item = info[i];
		const name = governanceKeyMap[i]["name"];
		data[name] = item[name];
	}

	return data;
};

export const useGovernance = () => {
	const { active, account, library, chainId } = useWeb3React();

	const [govList, setGovList] = useState<IProposal[]>([]);
	const [BOTStaked, setBOTStaked] = useState();
	const [govReward, setGovReward] = useState();
	const [govBOT, setGovBOT] = useState();

	function queryStaked() {
		const stakingContract = getContract(library, bounceStake.abi, getStakingAddress(chainId));

		try {
			stakingContract.methods
				.myTotalStake(account)
				.call()
				.then((res) => {
					setBOTStaked(res);
				});
		} catch (e) {
			console.log("myTotalStake error:", e);
		}

		try {
			stakingContract.methods
				.getGovReward(account)
				.call()
				.then((res) => {
					setGovReward(res);
				});
		} catch (e) {
			console.log("getGovReward error:", e);
		}

		const bot = getContract(library, bounceERC20.abi, getBotAddress(chainId));

		try {
			bot.methods
				.balanceOf("0xda67595745f74860f3360fedf744cee7293d2daf")
				.call()
				.then((res) => {
					setGovBOT(res);
				});
		} catch (e) {
			console.log("getGovReward error:", e);
		}
	}

	async function queryGovList() {
		console.log("govnance----> id", soliditySha3("proposes"), "--->", fromAscii("proposes"));

		const contract = getContract(library, bounceStake.abi, getStakingAddress(chainId));
		const index = await contract.methods.getConfig(soliditySha3("proposes"), 0).call();
		let id = index;
		let position = 0;
		let governanceList = [];
		let governance = null;
		let governanceID = 0;

		while (id != 0) {
			governanceID = await contract.methods.getConfig(soliditySha3("proposes"), id).call();
			governance = await queryGovernanceItem(contract, id);
			console.log("governance detail", governance);

			if (governance.voteResult.slice(0, "PROPOSE_STATUS_PASS".length) === "PROPOSE_STATUS_PASS") {
				governance.status = "Passed";
			} else if (
				governance.voteResult.slice(0, "PROPOSE_STATUS_FAIL".length) === "PROPOSE_STATUS_FAIL"
			) {
				governance.status = "Failed";
			} else {
				governance.status = "Live";
			}

			governance.position = position;
			console.log("queryGovernance creator", id, Web3.utils.numberToHex(governance.creator));

			governance.yesCount = await contract.methods
				.getVotes(int2hex(id, 64), asciiToHex("VOTE_YES"))
				.call();

			governance.noCount = await contract.methods
				.getVotes(int2hex(id, 64), asciiToHex("VOTE_NO"))
				.call();

			governance.cancelCount = await contract.methods
				.getVotes(int2hex(id, 64), asciiToHex("VOTE_CANCEL"))
				.call();

			console.log("query governance detail---->", int2hex(id, 64));
			governanceList = governanceList.concat(governance);
			// console.log('query governance--->', governance,numberToHex(id),asciiToHex('VOTE_YES'))
			id = governanceID;
			setGovList(governanceList.map((_) => _));
			position++;
		}

		console.log("governanceList:", governanceList);
	}

	useEffect(() => {
		if (active) {
			queryGovList();
			queryStaked();
		}
	}, [active]);

	return { govList, BOTStaked, govReward, govBOT };
};

export const useGovDetail = (id) => {
	const { active, library, chainId } = useWeb3React();
	const [gov, setGov] = useState<IProposal>();

	async function queryGovDetail() {
		const contract = getContract(library, bounceStake.abi, getStakingAddress(chainId));
		const governance: IProposal = await queryGovernanceItem(contract, id);
		console.log("detail governance", governance);

		if (governance.voteResult?.slice(0, "PROPOSE_STATUS_PASS".length) === "PROPOSE_STATUS_PASS") {
			governance.status = PROPOSAL_STATUS.PASSED;
		} else if (
			governance.voteResult?.slice(0, "PROPOSE_STATUS_FAIL".length) === "PROPOSE_STATUS_FAIL"
		) {
			governance.status = PROPOSAL_STATUS.FAILED;
		} else {
			governance.status = PROPOSAL_STATUS.LIVE;
		}

		console.log("queryGovernance creator", id, Web3.utils.numberToHex(governance.creator));

		governance.yesCount = await contract.methods
			.getVotes(int2hex(id, 64), asciiToHex("VOTE_YES"))
			.call();

		governance.noCount = await contract.methods
			.getVotes(int2hex(id, 64), asciiToHex("VOTE_NO"))
			.call();

		governance.cancelCount = await contract.methods
			.getVotes(int2hex(id, 64), asciiToHex("VOTE_CANCEL"))
			.call();

		console.log("query governance detail", governance);
		setGov(governance);
	}

	useEffect(() => {
		if (active) {
			queryGovDetail();
		}
	}, [active]);

	return { gov };
};

export enum ProcessStateEnum {
	"INITIAL" = "initial",
	"COMFIRMING" = "comfirming",
	"SUBMITTING" = "submitting",
	"SUCCESS" = "success",
	"CANCEL" = "cancel",
	"FAIL" = "fail",
}

export type PopUpTextType = {
	title: string;
	content: string;
};

export const PopUpTextObj = {
	COMFIRMING: {
		title: "Confirming your votes",
		content: "Please confirm your votes in metamask",
	},
	SUBMITTING: {
		title: "Waiting for confirmation…",
		content: "Submitting your vote decision",
	},
	SUCCESS: {
		title: "Congratulations!",
		content: "Submitting your vote decision",
	},
	CANCEL: {
		title: "Canceling your pool creation",
		content: "You canceled your pool creation",
	},
	FAIL: {
		title: "Oops!",
		content: "Something is wrong and please try again.",
	},
};

export enum OperationEnum {
	"FOR" = "voteYes",
	"AGAINST" = "voteNo",
	"NEUTRAL" = "voteCancle",
}

export const useVote = async (
	id: string,
	operation: OperationEnum,
	setState: (state: ProcessStateEnum) => void
) => {
	const { account, library, chainId } = useWeb3React();

	console.log("governance id", numberToHex(id));

	const contract = getContract(library, bounceStake.abi, getStakingAddress(chainId));

	try {
		setState(ProcessStateEnum.INITIAL);

		console.log("onVote", int2hex(id, 64));

		contract.methods[OperationEnum[operation]](int2hex(id, 64))
			.send({ from: account })
			.on("transactionHash", (hash) => {
				setState(ProcessStateEnum.SUBMITTING);
			})
			.on("receipt", (_, receipt) => {
				setState(ProcessStateEnum.SUCCESS);
			})
			.on("error", (err, receipt) => {
				setState(ProcessStateEnum.FAIL);
				console.log("error1", err);
			});
	} catch (err) {
		if (err.code === 4001) {
			setState(ProcessStateEnum.CANCEL);
		} else {
			setState(ProcessStateEnum.FAIL);
		}

		console.log("err", err);
	}
};
