import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Web3 from "web3";
import { fromWei } from "web3-utils";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Button } from "@app/ui/button";
import { Copy } from "@app/ui/icons/copy";
import { Exit } from "@app/ui/icons/exit";
import { ShortLogo } from "@app/ui/icons/short-logo";
import { walletConversion } from "@app/utils/convertWallet";

import { useWeb3 } from "@app/web3/hooks/use-web3";
import { getMyBalance } from "@app/web3/utils/get-balance";

import styles from "./UserInfo.module.scss";

import type { FC } from "react";

type UserInfoType = {
	balance?: string;
	address: string;
	ethBalance: string;
	name: string;
};

type ComponentType = UserInfoType & MaybeWithClassName;

export const UserInfoView: FC<ComponentType> = ({
	className,
	balance,
	address,
	name,
	ethBalance,
}) => {
	const convertedBalance = balance === undefined ? 0 : parseFloat(balance);

	const [isCopy, setCopy] = useState<boolean>(false);

	useEffect(() => {
		if (isCopy) {
			setTimeout(() => setCopy(false), 1000);
		}
	}, [isCopy]);

	return (
		<div className={classNames(className, styles.component)}>
			<span className={styles.balance}>
				{convertedBalance.toFixed(2)} {convertedBalance > 0 ? "Auctions" : "Auction"}
			</span>
			<span className={styles.address}>{walletConversion(address)}</span>
			<div className={styles.wrapper}>
				<Button className={styles.toggle} icon={<ShortLogo style={{ width: 14 }} />} rainbowHover>
					Account
				</Button>
				<div className={styles.dropdown}>
					<div className={styles.info}>
						<span className={styles.name}>{name}</span>
						<CopyToClipboard text={address} onCopy={() => setCopy(true)}>
							<p className={styles.copyAddress}>
								{walletConversion(address)}
								<Copy style={{ width: 20 }} />
							</p>
						</CopyToClipboard>
						<span className={styles.ethBalance}>{parseFloat(ethBalance).toFixed(2)} ETH</span>
					</div>
					<Button
						className={styles.logout}
						iconBefore={<Exit style={{ width: 18, marginRight: 8 }} />}
					>
						Log out
					</Button>
				</div>
			</div>
		</div>
	);
};

const fetchInformation = async (web3: Web3, ethereumAddress: string) => {
	return await getMyBalance(web3, ethereumAddress);
};

export const UserInfo = () => {
	const [ethBalance, setEthBalance] = useState("0");
	const [name, setName] = useState("John");

	const { active, account } = useWeb3React();
	const web3 = useWeb3();

	const updateData = useCallback(async () => {
		const myBalance = await fetchInformation(web3, account);

		setEthBalance(myBalance);
	}, [web3, account]);

	useEffect(() => {
		const tm = setInterval(updateData, 60000);

		return () => clearInterval(tm);
	}, [updateData]);

	useEffect(() => {
		if (active) {
			updateData();
		}
	}, [active, updateData]);

	return <UserInfoView address={account} ethBalance={fromWei(ethBalance)} name={name} />;
};
