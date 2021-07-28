import React, { useState } from "react";

import { FC } from "react";

import { RC } from "@app/helper/react/types";
import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { Heading1 } from "@app/ui/typography";
import { useWalletConnection } from "@app/web3/hooks/use-connection";

import styles from "./ConnectWalletModal.module.scss";
import { MetaIcon, RightArrow, WalletIcon } from "./icons";

type ConnectWallet = {
	sideEffect?: any;
	disable: boolean;
	onMetamask(): void;
	onWalletConnect(): void;
};

export const ConnectWallet: FC<ConnectWallet> = ({
	sideEffect,
	disable,
	onMetamask,
	onWalletConnect,
}) => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Connect your wallet
			</Heading1>
			<ul className={styles.list}>
				<li className={styles.item}>
					<button className={styles.button} type="button" onClick={onMetamask} disabled={disable}>
						<span className={styles.icon}>
							<MetaIcon />
						</span>
						Metamask
						<RightArrow className={styles.arrow} />
					</button>
				</li>
				<li className={styles.item}>
					<button
						className={styles.button}
						type="button"
						onClick={onWalletConnect}
						disabled={disable}
					>
						<span className={styles.icon}>
							<WalletIcon />
						</span>
						WalletConnect
						<RightArrow className={styles.arrow} />
					</button>
				</li>
			</ul>
			{sideEffect}
		</div>
	);
};

export const ConnectWalletModal: RC<{
	control: ScatteredContinuousState<boolean>;
	close(): void;
}> = ({ close, control }) => {
	const [connecting, setConnectionStatus] = useState(false);
	const { connect: connectWallet } = useWalletConnection();

	const connectMetamask = async () => {
		try {
			setConnectionStatus(true);
			await connectWallet("MetaMask");
		} catch (e) {
			console.error(e);
		} finally {
			setConnectionStatus(false);
			close();
		}
	};

	const connectWalletConnect = async () => {
		try {
			setConnectionStatus(true);
			await connectWallet("WalletConnect");
		} catch (e) {
			console.error(e);
		} finally {
			setConnectionStatus(false);
			close();
		}
	};

	return (
		<PopUpContainer
			animated={control.present}
			visible={control.defined}
			// onClose={connecting ? undefined : close}
			onClose={close}
			maxWidth={640}
			scrollable={false}
		>
			<ConnectWallet
				disable={connecting}
				onMetamask={connectMetamask}
				onWalletConnect={connectWalletConnect}
				sideEffect={<control.DefinePresent />}
			/>
		</PopUpContainer>
	);
};
