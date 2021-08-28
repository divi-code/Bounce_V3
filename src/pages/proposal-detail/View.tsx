import { useWeb3React } from "@web3-react/core";
import classnames from "classnames";
import { FC, useState, useEffect, ReactNode } from "react";

import Web3 from "web3";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { CopyAddress } from "@app/modules/copy-to-clipboard";
import { DisplayGovernanceInfoType } from "@app/modules/governance-card";

import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { Timer } from "@app/modules/timer";
import { VotePopUp } from "@app/modules/vote-pop-up";
import { PrimaryButton, Button } from "@app/ui/button";
import { ProgressBar } from "@app/ui/governance-progress-bar";
import { GutterBox } from "@app/ui/gutter-box";
import { RightArrow } from "@app/ui/icons/arrow-right";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { Status } from "@app/ui/proposal-status";
import { Body1, Caption, Heading1, Heading2, Heading3 } from "@app/ui/typography";
import { IProposal, PROPOSAL_STATUS } from "@app/utils/governance";
import { toThousands } from "@app/utils/toThousands";

import bounceStake from "@app/web3/api/bounce/BounceStake.abi.json";
import {
	ProcessStateEnum,
	int2hex,
	OperationEnum,
	getStakingAddress,
	getContract,
	PopUpTextObj,
	PopUpTextType,
} from "@app/web3/api/bounce/governance";

import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./View.module.scss";

type ProposalDetailViewType = {
	// actionTitle: string;
	// alert?: ReactNode;
	// amount: number;
	// limit?: number;
	// openAt: number;
	// closeAt: number;
	// claimAt?: Date;
	// onZero(): void;
	onBack(): void;
};

interface IProposalView extends IProposal {
	proposalIndex: number;
}

export const View: FC<IProposalView & ProposalDetailViewType> = ({
	onBack,
	proposalIndex,
	content,
	yesCount,
	noCount,
	cancelCount,
	creator,
	index,
	status,
	time,
	title,
	voteResult,
}) => {
	const { account, library, chainId } = useWeb3React();
	console.log("library: ", library);

	const Web3Provider = useWeb3Provider();
	console.log("Web3Provider: ", Web3Provider);

	const STATUS: Record<PROPOSAL_STATUS, ReactNode> = {
		[PROPOSAL_STATUS.LIVE]: (
			<Timer timer={Number(time) * 1000} onZero={() => console.log("ON ZERO")} />
		),
		[PROPOSAL_STATUS.PASSED]: "Passed",
		[PROPOSAL_STATUS.FAILED]: "Failed",
	};

	const [operation, setOperation] = useState<OperationEnum>(OperationEnum.FOR);
	const [optionDescription, setOptionDescription] = useState<String>();
	const [ProcessState, setProcessState] = useState<ProcessStateEnum>(ProcessStateEnum.INITIAL);
	const [popUpText, setPopUpText] = useState<PopUpTextType>();

	const { numberToHex } = Web3.utils;
	const { open, close, popUp } = useControlPopUp();

	const handleVote = async () => {
		console.log("governance id", numberToHex(index));

		const contract = getContract(library, bounceStake.abi, getStakingAddress(chainId));

		try {
			setProcessState(ProcessStateEnum.COMFIRMING);
			setPopUpText(PopUpTextObj.COMFIRMING);
			open();

			contract.methods[operation](int2hex(index, 64))
				.send({ from: "account" })
				.on("transactionHash", (hash) => {
					setProcessState(ProcessStateEnum.SUBMITTING);
					setPopUpText(PopUpTextObj.SUBMITTING);
				})
				.on("receipt", (_, receipt) => {
					setProcessState(ProcessStateEnum.SUCCESS);
					setPopUpText(PopUpTextObj.SUCCESS);
				})
				.on("error", (err, receipt) => {
					console.log("error1", err);

					if (err.code === 4001) {
						setProcessState(ProcessStateEnum.CANCEL);
						setPopUpText(PopUpTextObj.CANCEL);
					} else {
						setProcessState(ProcessStateEnum.FAIL);
						setPopUpText(PopUpTextObj.FAIL);
					}
				});
		} catch (err) {
			console.log("err", err);

			if (err.code === 4001) {
				setProcessState(ProcessStateEnum.CANCEL);
				setPopUpText(PopUpTextObj.CANCEL);
			} else {
				setProcessState(ProcessStateEnum.FAIL);
				setPopUpText(PopUpTextObj.FAIL);
			}
		}
	};

	const _yesCount = Number(yesCount) / 1e18;
	const _noCount = Number(noCount) / 1e18;
	const _cancelCount = Number(cancelCount) / 1e18;

	useEffect(() => {
		if (!content) return;

		if (operation === OperationEnum.FOR) setOptionDescription(content.agreeFor);

		if (operation === OperationEnum.AGAINST) setOptionDescription(content.againstFor);

		if (operation === OperationEnum.NEUTRAL) setOptionDescription("");
	}, [operation, content]);

	return (
		<section className={styles.component}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						<Button
							variant="text"
							color="primary-black"
							onClick={onBack}
							iconBefore={
								<RightArrow style={{ width: 8, marginRight: 12, transform: "rotate(180deg)" }} />
							}
						>
							Go Back
						</Button>

						<Caption Component="span" weight="medium">
							#{proposalIndex}
						</Caption>
					</div>

					<div className={styles.titleTimer}>
						<Status status={status} captions={STATUS} />
						<Heading1 className={styles.title}>{title}</Heading1>

						<div className={styles.address}>
							<Caption className={styles.copy} Component="span" weight="medium">
								{creator}
							</Caption>
						</div>
					</div>

					<div className={styles.infoWrapper}>
						<Body1 className={styles.description}>{content?.details}</Body1>
						<GutterBox className={styles.voteInfo}>
							<Heading2 className={styles.votesAmount}>{`${
								_yesCount && _noCount ? _yesCount + _noCount : ``
							} votes:`}</Heading2>

							<Caption Component="span" className={styles.strVoteFor} lighten={50}>
								Votes For:
							</Caption>
							<Caption Component="span" className={styles.strVoteAgainst} lighten={50}>
								Votes Against:
							</Caption>

							<ProgressBar
								className={styles.bar}
								fillInPercentage={
									_yesCount && _noCount ? (_yesCount / (_yesCount + _noCount)) * 100 : 0
								}
								status={status}
							/>

							<Caption Component="span" className={styles.forAmount} lighten={50}>
								{`${toThousands(_yesCount) || "--"} Auction`}
							</Caption>
							<Caption Component="span" className={styles.againstAmount} lighten={50}>
								{`${toThousands(_noCount) || "--"} Auction`}
							</Caption>
						</GutterBox>
					</div>

					<GutterBox className={styles.votePanel}>
						<Heading2 className={styles.strMakeDecision}>make your decision</Heading2>

						<div className={styles.tabsWrapper}>
							<ul className={styles.tabs}>
								<Button
									className={classnames(
										styles.tab,
										operation === OperationEnum.FOR ? styles.active : null
									)}
									onClick={() => setOperation(OperationEnum.FOR)}
								>
									<Heading3 className={styles.strVoteFor}>Vote For</Heading3>
									<Caption Component="span" className={styles.price}>
										{`${_yesCount} Auction`}
									</Caption>
								</Button>
								<Button
									className={classnames(
										styles.tab,
										operation === OperationEnum.AGAINST ? styles.active : null
									)}
									onClick={() => setOperation(OperationEnum.AGAINST)}
								>
									<Heading3 className={styles.strVoteFor}>Vote Against</Heading3>
									<Caption Component="span" className={styles.price}>
										{`${_noCount} Auction`}
									</Caption>
								</Button>
								<Button
									className={classnames(
										styles.tab,
										operation === OperationEnum.NEUTRAL ? styles.active : null
									)}
									onClick={() => setOperation(OperationEnum.NEUTRAL)}
								>
									<Heading3 className={styles.strVoteFor}>Vote Neutral</Heading3>
									<Caption Component="span" className={styles.price}>
										{`${_cancelCount} Auction`}
									</Caption>
								</Button>
							</ul>
						</div>

						<Caption Component="p" className={styles.description}>
							{optionDescription}
						</Caption>

						<PrimaryButton className={styles.submitBtn} submit onClick={handleVote}>
							<Body1 className={styles.strSubmit}>Submit</Body1>
						</PrimaryButton>
					</GutterBox>
				</div>
			</GutterBox>
			{popUp.defined ? (
				<ProcessingPopUp
					title={popUpText.title}
					text={popUpText.title}
					onSuccess={() => {
						close();
					}}
					onTry={handleVote}
					isSuccess={ProcessState === ProcessStateEnum.SUCCESS}
					isLoading={
						ProcessState === ProcessStateEnum.COMFIRMING ||
						ProcessState === ProcessStateEnum.SUBMITTING
					}
					isError={
						ProcessState === ProcessStateEnum.FAIL || ProcessState === ProcessStateEnum.CANCEL
					}
					control={popUp}
					close={() => {
						close();
					}}
				/>
			) : undefined}
		</section>
	);
};
