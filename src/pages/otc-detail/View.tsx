import { FC, ReactNode } from "react";

import { Currency } from "@app/modules/currency";
import { Symbol } from "@app/modules/symbol";
import { Timer } from "@app/modules/timer";
import { DisplayOTCInfoType } from "@app/pages/otc/ui/card";
import { Button } from "@app/ui/button";
import { DescriptionList } from "@app/ui/description-list";
import { GutterBox } from "@app/ui/gutter-box";

import { RightArrow } from "@app/ui/icons/arrow-right";
import { ProgressBar } from "@app/ui/progress-bar";
import { Status } from "@app/ui/status";
import { Caption, Heading1, Heading2 } from "@app/ui/typography";

import { walletConversion } from "@app/utils/convertWallet";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./View.module.scss";

type OTCDetailViewType = {
	actionTitle: string;
	alert?: ReactNode;
	amount: number;
	total: number;
	openAt: number;
	onZero(): void;
	onBack(): void;
};

export const View: FC<DisplayOTCInfoType & OTCDetailViewType> = ({
	id,
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
	onZero,
	openAt,
	actionTitle,
	onBack,
}) => {
	const TOKEN_INFORMATION = {
		"Contact address": walletConversion(address),
		"Token symbol": <Currency token={token} small />,
	};

	const OTC_INFORMATION = {
		"Payment currency": <Currency token={currency} small />,
		"Price per unit, $": price,
	};

	const STATUS: Record<POOL_STATUS, ReactNode> = {
		[POOL_STATUS.COMING]: <Timer timer={openAt} onZero={onZero} />,
		[POOL_STATUS.LIVE]: "Live",
		[POOL_STATUS.FILLED]: "Filled",
		[POOL_STATUS.CLOSED]: "Closed",
		[POOL_STATUS.ERROR]: "Error",
	};

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
							#{id}
						</Caption>
					</div>
					<Heading1 className={styles.title}>{name}</Heading1>
					{alert && <div className={styles.alert}>{alert}</div>}
					<div className={styles.content}>
						<div className={styles.info}>
							<Caption className={styles.type} weight="bold">
								OTC type<span>{type}</span>
							</Caption>
							<DescriptionList
								className={styles.list}
								title="Token Information"
								data={TOKEN_INFORMATION}
							/>
							<DescriptionList
								className={styles.list}
								title="OTC Information"
								data={OTC_INFORMATION}
							/>
							<div className={styles.progress}>
								<Caption Component="h3" className={styles.progressCaption} weight="medium">
									Auction progress
								</Caption>
								<Caption Component="span" weight="regular">
									{amount} <Symbol token={currency} /> / {total} <Symbol token={currency} />
								</Caption>
								<ProgressBar className={styles.bar} status={status} fillInPercentage={fill} />
							</div>
						</div>
						<div className={styles.action}>
							<div className={styles.header}>
								<Heading2 className={styles.actionTitle}>{actionTitle}</Heading2>
								<Status status={status} captions={STATUS} />
							</div>
							<div className={styles.body}>{children}</div>
						</div>
					</div>
				</div>
			</GutterBox>
		</section>
	);
};
