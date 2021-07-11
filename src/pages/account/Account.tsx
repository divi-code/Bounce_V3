import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import React, { FC } from "react";

import { ACCOUNT_PATH, CERTIFIED_PATH, FANGIBLE_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CopyAddress } from "@app/modules/copy-to-clipboard";
import { Activity } from "@app/pages/account/Activity";
import { Auction } from "@app/pages/account/Auction";
import { Otc } from "@app/pages/account/Otc";
import { NavLink } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";

import { Body1 } from "@app/ui/typography";

import styles from "./Account.module.scss";

export const Account: FC<{ type: "otc" | "auction" | "activity" } & MaybeWithClassName> = ({
	className,
	type,
}) => {
	const { account } = useWeb3React();

	return (
		<div className={classNames(className, styles.component)}>
			<section>
				<GutterBox>
					<div className={styles.header}>
						<div className={styles.info}>
							<Body1 className={styles.connect} lighten={50} Component="span">
								Connected with MetaMask
							</Body1>
							<CopyAddress className={styles.copy} address={account} />
						</div>
						<div className={styles.buttons}>
							<NavLink href={FANGIBLE_PATH} variant="outlined" size="medium" color="primary-white">
								Go to Fangible
							</NavLink>
							<NavLink href={CERTIFIED_PATH} variant="outlined" size="medium" color="primary-white">
								Go to Bounce Certified
							</NavLink>
						</div>
					</div>
					<div className={styles.tabs}>
						<NavLink
							className={styles.tab}
							activeClassName={styles.active}
							href={`${ACCOUNT_PATH}`}
							weight="bold"
							exact
						>
							My Auctions
						</NavLink>
						<NavLink
							className={styles.tab}
							activeClassName={styles.active}
							href={`${ACCOUNT_PATH}/otc`}
							weight="bold"
						>
							My OTC
						</NavLink>
						<NavLink
							className={styles.tab}
							activeClassName={styles.active}
							href={`${ACCOUNT_PATH}/activity`}
							weight="bold"
						>
							Activity
						</NavLink>
					</div>
				</GutterBox>
			</section>
			<section className={className}>
				<GutterBox>
					{type === "otc" && <Otc />}
					{type === "auction" && <Auction />}
					{type === "activity" && <Activity />}
				</GutterBox>
			</section>
		</div>
	);
};
