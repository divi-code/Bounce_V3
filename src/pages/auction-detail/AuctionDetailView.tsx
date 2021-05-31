import { FC, ReactNode } from "react";

import { Currency } from "@app/modules/currency";
import { DisplayPoolInfoType } from "@app/pages/auction";
import { DescriptionList } from "@app/ui/description-list";
import { GutterBox } from "@app/ui/gutter-box";

import { ProgressBar } from "@app/ui/progress-bar";
import { Caption, Heading1 } from "@app/ui/typography";

import { walletConversion } from "@app/utils/convertWallet";

import styles from "./AuctionDetail.module.scss";

type AuctionDetailViewType = {
	alert?: ReactNode;
	amount: string;
};

export const AuctionDetailView: FC<DisplayPoolInfoType & AuctionDetailViewType> = ({
	name,
	alert,
	children,
	address,
	token,
	type,
	amount,
	currency,
	price,
	total,
	status,
	fill,
}) => {
	const TOKEN_INFORMATION = {
		"Contact address": walletConversion(address),
		"Token symbol": <Currency token={token} small />,
	};

	const AUCTION_INFORMATION = {
		"Pool type": type,
		"Auction amount": total,
		"Auction currency": <Currency token={currency} small />,
		"Price per unit, $": price,
	};

	return (
		<section className={styles.component}>
			<GutterBox>
				<div className={styles.wrapper}>
					<Heading1 className={styles.title}>{name}</Heading1>
					{alert && <div className={styles.alert}>{alert}</div>}
					<div className={styles.content}>
						<div className={styles.info}>
							<DescriptionList
								className={styles.list}
								title="Token Information"
								data={TOKEN_INFORMATION}
							/>
							<DescriptionList
								className={styles.list}
								title="Auction Information"
								data={AUCTION_INFORMATION}
							/>
							<div className={styles.progress}>
								<Caption Component="h3" className={styles.caption} weight="medium">
									Auction progress
								</Caption>
								<Caption Component="span" className={styles.caption} weight="medium">
									{amount} {currency} / {total} {currency}
								</Caption>
								<ProgressBar status={status} fillInPercentage={fill} />
							</div>
						</div>
						<div className={styles.action}>{children}</div>
					</div>
				</div>
			</GutterBox>
		</section>
	);
};
