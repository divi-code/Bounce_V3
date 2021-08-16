import { FC, ReactNode } from "react";

import { IToken } from "@app/api/types";
import { Currency } from "@app/modules/currency";

import { PrimaryButton } from "@app/ui/button";
import { DescriptionList } from "@app/ui/description-list";
import { Spinner } from "@app/ui/spinner";

import { divide, roundedMultiplied } from "@app/utils/bn";

import styles from "./Claim.module.scss";

type AuctionDetailClaimType = {
	// token: string;
	amount: number;
	price: number;
	to: IToken;
	from: IToken;
	disabled: boolean;
	isNonAction: boolean;
	loading: boolean;
	children?: ReactNode;
	onClick?(): void;
	userBid: number;
	userPay: number;
};

export const Claim: FC<AuctionDetailClaimType> = ({
	children,
	// token,
	amount,
	price,
	from,
	to,
	onClick,
	disabled,
	loading,
	isNonAction,
	userBid,
	userPay,
}) => {
	return (
		<div className={styles.component}>
			<DescriptionList
				data={{
					"Bid swap ratio": (
						<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
							1{"\u00a0"}
							<Currency token={from.address} small />
							{"\u00a0"}={"\u00a0"}
							{price}
							{"\u00a0"}
							<Currency token={to.address} small />
						</span>
					),
					"Total bid amount": (
						<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
							{roundedMultiplied(userBid, price).toString()}
							{"\u00a0"}
							<Currency token={to.address} small />
						</span>
					),
					"Successful bid amount": (
						<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
							{userBid}
							{"\u00a0"}
							<Currency token={from.address} small />
						</span>
					),
				}}
			/>
			{!isNonAction && (
				<PrimaryButton className={styles.button} size="large" onClick={onClick} disabled={disabled}>
					{loading ? <Spinner size="small" /> : children}
				</PrimaryButton>
			)}
		</div>
	);
};
