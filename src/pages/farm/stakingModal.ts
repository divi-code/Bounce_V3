export enum OPERATION {
	default = "default",
	approval = "approval",
	confirm = "confirm",
	pending = "pending",
	successStake = "successStake",
	successUnStake = "successUnStake",
	successClaim = "successClaim",
	error = "error",
	cancel = "cancel",
}

export const TITLE = {
	[OPERATION.approval]: "Bounce Requests Approval",
	[OPERATION.confirm]: "Waiting for confirmation",
	[OPERATION.pending]: "Staking Bounce Finance",
	[OPERATION.successStake]: "Success!",
	[OPERATION.successUnStake]: "Success!",
	[OPERATION.successClaim]: "Success!",
	[OPERATION.error]: "Transaction Failed",
	[OPERATION.cancel]: "Transaction Failed",
};

export const CONTENT = {
	[OPERATION.approval]: "Please enable Bounce to access your tokens",
	[OPERATION.confirm]: "Confirm this transaction in your wallet",
	[OPERATION.pending]: "Please wait a moment.",
	[OPERATION.successStake]: "You have successfully staked your Auction.",
	[OPERATION.successUnStake]: "You have successfully unstaked your Auction.",
	[OPERATION.successClaim]: "You have successfully claimed your Auction.",
	[OPERATION.error]: "Your transaction was cancelled and wasn’t submitted",
	[OPERATION.cancel]: "Your transaction was cancelled and wasn’t submitted",
};
