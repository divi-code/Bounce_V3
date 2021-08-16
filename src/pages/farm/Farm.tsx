import classNames from "classnames";
import React, { FC } from "react";

import { Button } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";
import { ShortLogo } from "@app/ui/icons/short-logo";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./Farm.module.scss";

export const Farm: FC<MaybeWithClassName> = ({ className }) => {
	return (
		<div className={classNames(className, styles.component)}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.headLeftContent}>
							<span className={styles.logoIcon}>
								<ShortLogo style={{ width: 9, height: 14, color: "#fff" }} />
							</span>
							<span className={styles.logoTit}>Auction</span>
						</div>
						<div className={styles.headRightContent}>
							<span className={styles.label}>APY</span>
							<span className={styles.value}>155.73%</span>
						</div>
					</div>
					<div className={styles.rewardWrap}>
						<div className={styles.rewardsLable}>
							<span>Your Staking Rewards Estimation</span>
							<Button style={{ color: "#2E57F7" }}>Claim Rewards</Button>
						</div>
						<div className={styles.rewardsValue}>
							<span>748.562</span>
							<span>Auction</span>
						</div>
						<div className={styles.buttons}>
							<Button size="large" color="primary-black" variant="contained">
								Stake
							</Button>
							<Button size="large" color="primary-black" variant="contained">
								Unstake
							</Button>
						</div>
						<div className={styles.amountWrapper}>
							<div className={styles.amountItem}>
								<span>Your Stake</span>
								<span>12345.00</span>
							</div>
							<div className={styles.amountItem}>
								<span>Pooled Total</span>
								<span>12345.00</span>
							</div>
						</div>
					</div>
				</div>
			</GutterBox>
		</div>
	);
};
