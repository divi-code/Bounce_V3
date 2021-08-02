import BigNumber from "bignumber.js";
import classNames from "classnames";
import { FC, ReactNode } from "react";

import { POOL_SHORT_NAME_MAPPING, POOL_SPECIFIC_NAME_MAPPING } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { useConvertDate } from "@app/hooks/use-convert-data";
import { Currency } from "@app/modules/currency";
import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowData } from "@app/modules/flow/hooks";
import { Symbol } from "@app/modules/symbol";
import { DescriptionList } from "@app/ui/description-list";

import { Heading3 } from "@app/ui/typography";
import { walletConversion } from "@app/utils/convertWallet";

import { ALLOCATION_TYPE, FixedOutType } from "../fixed";
import { SettingsOutType } from "../settings";
import { TokenOutType } from "../token";

import styles from "./Confirmation.module.scss";

type ConfirmationType = {
	name: string;
	type: string;
	address: string;
	tokenFrom: ReactNode;
	declaim: string;
	tokenTo: ReactNode;
	swapRatio: ReactNode;
	amount: number;
	allocation: ReactNode;
	whitelist: string;
	duration: ReactNode;
	delay: string;
};

type CommonType = {
	type: string;
};

export const ConfirmationView: FC<MaybeWithClassName & ConfirmationType & CommonType> = ({
	className,
	name,
	type,
	address,
	tokenFrom,
	declaim,
	tokenTo,
	swapRatio,
	amount,
	allocation,
	whitelist,
	duration,
	delay,
}) => {
	const TOKEN_DATA = {
		"Contact address": address,
		"Token symbol": tokenFrom,
		"Token declaim": declaim,
	};

	const PARAMETERS_DATA = {
		"Pool type": type,
		To: tokenTo,
		"Swap Ratio": swapRatio,
		Amount: amount,
		"Allocation per Wallet": allocation,
	};

	const SETTINGS_DATA = {
		Participations: whitelist,
		"Pool duration": duration,
		"Delay Unlocking Token": delay,
	};

	return (
		<div className={classNames(className, styles.component)}>
			<Heading3 className={styles.title}>{name}</Heading3>
			<DescriptionList title="Token Information" data={TOKEN_DATA} />
			<DescriptionList title="Auction Parameters" data={PARAMETERS_DATA} />
			<DescriptionList title="Advanced Setting" data={SETTINGS_DATA} />
		</div>
	);
};

export type ConfirmationInType = TokenOutType & SettingsOutType & FixedOutType;

export const ConfirmationImp: FC<CommonType> = ({ type }) => {
	const {
		poolName,
		tokenFromAddress,
		tokenFrom,
		tokenDecimal,
		tokenTo,
		swapRatio,
		amount,
		allocation,
		limit,
		whitelist,
		startPool,
		endPool,
		delayClaim,
		claimStart,
	} = useFlowData<ConfirmationInType>();

	const convertDate = useConvertDate();

	return (
		<ConfirmationView
			name={`${poolName} ${POOL_SPECIFIC_NAME_MAPPING[type]}`}
			address={walletConversion(tokenFromAddress)}
			tokenFrom={<Currency token={tokenFrom} small={true} />}
			declaim={tokenDecimal}
			tokenTo={<Currency token={tokenTo} small={true} />}
			swapRatio={
				<>
					1 <Symbol token={tokenFrom} /> = {swapRatio} <Symbol token={tokenTo} />
				</>
			}
			amount={parseFloat(new BigNumber(amount).multipliedBy(new BigNumber(swapRatio)).toString())}
			allocation={
				allocation === ALLOCATION_TYPE.limited ? (
					<>
						Limit {limit} <Symbol token={tokenTo} />
					</>
				) : (
					"No Limits"
				)
			}
			whitelist={whitelist ? "Whitelist" : "Public"}
			duration={
				<div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
					<span>{`From ${convertDate(new Date(startPool), "long")}`}</span>
					<span>{`To ${convertDate(new Date(endPool), "long")}`}</span>
				</div>
			}
			delay={delayClaim ? convertDate(new Date(claimStart), "long") : "No"}
			type={POOL_SHORT_NAME_MAPPING[type]}
		/>
	);
};

export const Confirmation = defineFlowStep<ConfirmationInType, {}, MaybeWithClassName & CommonType>(
	{
		Body: ConfirmationImp,
	}
);
