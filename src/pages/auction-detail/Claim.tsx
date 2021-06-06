import { FC, ReactNode } from "react";

import { Currency } from "@app/modules/currency";

import { PrimaryButton } from "@app/ui/button";
import { DescriptionList } from "@app/ui/description-list";
import { Spinner } from "@app/ui/spinner";

import styles from "./Claim.module.scss";

type AuctionDetailClaimType = {
	token: string;
	amount: number;
	price: number;
	currency: string;
	disabled: boolean;
	isNonAction: boolean;
	loading: boolean;
	children?: ReactNode;
	onClick?(): void;
};

export const Claim: FC<AuctionDetailClaimType> = ({
	children,
	token,
	amount,
	price,
	currency,
	onClick,
	disabled,
	loading,
	isNonAction,
}) => {
	return (
		<div className={styles.component}>
			<DescriptionList
				data={{
					"Bid swap ratio": (
						<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
							1{"\u00a0"}
							<Currency token={token} small />
							{"\u00a0"}={"\u00a0"}
							{price}
							{"\u00a0"}
							<Currency token={currency} small />
						</span>
					),
					"Total bid amount": (
						<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
							{amount}
							{"\u00a0"}
							<Currency token={currency} small />
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
