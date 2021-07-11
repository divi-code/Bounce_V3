import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";

import React, { useCallback, useEffect, useState } from "react";

import { ACCOUNT_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CopyAddress } from "@app/modules/copy-to-clipboard";
import { Button, NavLink } from "@app/ui/button";
import { Exit } from "@app/ui/icons/exit";
import { ShortLogo } from "@app/ui/icons/short-logo";
import { fromWei } from "@app/utils/bn/wei";
import { walletConversion } from "@app/utils/convertWallet";

import { getEthBalance } from "@app/web3/api/bounce/erc";
import { useWalletConnection } from "@app/web3/hooks/use-connection";
import { useChainId, useWeb3 } from "@app/web3/hooks/use-web3";

import { WEB3_NETWORKS } from "@app/web3/networks/const";

import styles from "./UserInfo.module.scss";

import type { FC } from "react";

type UserInfoType = {
	balance: string;
	address: string;
	token: string;
	onLogout(): void;
};

type ComponentType = UserInfoType & MaybeWithClassName;

export const UserInfoView: FC<ComponentType> = ({
	className,
	balance,
	address,
	token,
	onLogout,
}) => {
	return (
		<div className={classNames(className, styles.component)}>
			<span className={styles.balance}>
				{balance} {token}
			</span>
			<span className={styles.address}>{walletConversion(address)}</span>
			<div className={styles.wrapper}>
				<Button className={styles.toggle} icon={<ShortLogo style={{ width: 14 }} />} rainbowHover>
					Account
				</Button>
				<div className={styles.dropdown}>
					<div className={styles.info}>
						<CopyAddress className={styles.copyAddress} address={address} />
					</div>
					<div className={styles.links}>
						<NavLink className={styles.link} href={`${ACCOUNT_PATH}`} weight="bold" exact>
							My Auctions
						</NavLink>
						<NavLink className={styles.link} href={`${ACCOUNT_PATH}/otc`} weight="bold">
							My OTC
						</NavLink>
						<NavLink className={styles.link} href={`${ACCOUNT_PATH}/activity`} weight="bold">
							Activities
						</NavLink>
					</div>
					<Button
						className={styles.logout}
						iconBefore={<Exit style={{ width: 18, marginRight: 8 }} />}
						onClick={onLogout}
					>
						Log out
					</Button>
				</div>
			</div>
		</div>
	);
};

export const UserInfo = () => {
	const [balance, setBalance] = useState("0");

	const { account } = useWeb3React();
	const web3 = useWeb3();
	const chainId = useChainId();

	const updateData = useCallback(async () => {
		getEthBalance(web3, account).then((b) => setBalance(b));
	}, [account, web3]);

	useEffect(() => {
		const tm = setInterval(() => {
			updateData();
		}, 2000);

		return () => {
			clearInterval(tm);
		};
	}, [updateData]);

	const { disconnect: disconnectWallet } = useWalletConnection();

	return (
		<UserInfoView
			address={account}
			token={chainId === WEB3_NETWORKS.BINANCE ? "BNS" : "ETH"}
			balance={parseFloat(fromWei(balance, 18).toFixed(4, 1)).toString()}
			onLogout={disconnectWallet}
		/>
	);
};
