import classNames from "classnames";
import { FC, ReactNode } from "react";

import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { useConvertDate } from "@app/hooks/use-convert-data";
import { Currency } from "@app/modules/currency";
import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowData } from "@app/modules/flow/hooks";
import { Symbol } from "@app/modules/symbol/Symbol";
import { BuyingOutType } from "@app/pages/create-otc/ui/buying";
import { Selling, SellingOutType } from "@app/pages/create-otc/ui/selling";
import { DescriptionList } from "@app/ui/description-list";

import { Heading3 } from "@app/ui/typography";
import { walletConversion } from "@app/utils/convertWallet";

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
	unitPrice: ReactNode;
	amount: number;
	whitelist: string;
	start: string;
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
	unitPrice,
	amount,
	whitelist,
	start,
}) => {
	const TOKEN_DATA = {
		"Contact address": address,
		"Token symbol": tokenFrom,
		"Token declaim": declaim,
	};

	const PARAMETERS_DATA = {
		"Pool type": type,
		"Desired Amount": amount,
		"Receipt Currency": tokenTo,
		"Unit Price": unitPrice,
	};

	const SETTINGS_DATA = {
		Participations: whitelist,
		"Start time": start,
	};

	return (
		<div className={classNames(className, styles.component)}>
			<Heading3 className={styles.title}>{name}</Heading3>
			<DescriptionList title="Token Information" data={TOKEN_DATA} />
			<DescriptionList title="OTC Parameters" data={PARAMETERS_DATA} />
			<DescriptionList title="Advanced Setting" data={SETTINGS_DATA} />
		</div>
	);
};

export type BuyingConfirmationType = TokenOutType & SettingsOutType & BuyingOutType;
export type SellingConfirmationType = TokenOutType & SettingsOutType & SellingOutType;

export type ConfirmationInType = BuyingConfirmationType | SellingConfirmationType;

export const ConfirmationImp: FC<CommonType> = ({ type }) => {
	const {
		poolName,
		tokenFromAddress,
		tokenFrom,
		tokenDecimal,
		tokenTo,
		unitPrice,
		amount,
		whitelist,
		startPool,
	} = useFlowData<ConfirmationInType>();

	const convertDate = useConvertDate();

	return (
		<ConfirmationView
			name={`${poolName} OTC Pool`}
			address={walletConversion(tokenFromAddress)}
			tokenFrom={<Currency token={tokenFrom} small={true} />}
			declaim={tokenDecimal}
			tokenTo={<Currency token={tokenTo} small={true} />}
			unitPrice={
				<>
					1 <Symbol token={tokenFrom} /> = {unitPrice} <Symbol token={tokenTo} />
				</>
			}
			amount={amount * unitPrice}
			whitelist={whitelist ? "Whitelist" : "Public"}
			start={convertDate(new Date(startPool), "long")}
			type={OTC_SHORT_NAME_MAPPING[type]}
		/>
	);
};

export const Confirmation = defineFlowStep<ConfirmationInType, {}, MaybeWithClassName & CommonType>(
	{
		Body: ConfirmationImp,
	}
);
