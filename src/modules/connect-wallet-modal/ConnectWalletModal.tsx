import { useWeb3React } from "@web3-react/core";

import React, { useEffect, useState } from "react";

import { RC } from "@app/helper/react/types";
import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { useWalletConnection } from "@app/web3/hooks/use-connection";

import theme from "../../ui/styles/Theme.module.scss";

import styles from "./ConnectWalletModal.module.scss";
import { MetaIcon, RightArrow, WalletIcon } from "./icons";

const ConnectWalletModalBase: RC<{
	control: ScatteredContinuousState<boolean>;
	withoutClose?: boolean;
	close(): void;
}> = ({ close, control, withoutClose }) => {
	const [connecting, setConnectionStatus] = useState(false);
	const connectWallet = useWalletConnection();

	const connectMetamask = async () => {
		try {
			setConnectionStatus(true);
			await connectWallet("MetaMask");
		} catch (e) {
			console.error(e);
		} finally {
			setConnectionStatus(false);
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
		}
	};

	return (
		<PopUpContainer
			className={theme.light}
			animated={control.present}
			visible={control.defined}
			size="sm"
			onClose={connecting ? undefined : close}
			withoutClose={withoutClose}
			focusLock={false}
		>
			<div className={styles.component}>
				<h2 className={styles.title}>Connect to a wallet</h2>
				<ul className={styles.list}>
					<li className={styles.item}>
						<button
							className={styles.button}
							type="button"
							onClick={connectMetamask}
							disabled={connecting}
						>
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
							onClick={connectWalletConnect}
							disabled={connecting}
						>
							<span className={styles.icon}>
								<WalletIcon />
							</span>
							WalletConnect
							<RightArrow className={styles.arrow} />
						</button>
					</li>
				</ul>
				<control.DefinePresent />
			</div>
		</PopUpContainer>
	);
};

export const ConnectWalletModal = () => {
	const { active } = useWeb3React();
	const { popUp, close, open } = useControlPopUp();

	useEffect(() => {
		if (active) {
			close();
		} else {
			open();
		}
	}, [active]);

	return popUp.defined ? (
		<ConnectWalletModalBase control={popUp} close={close} withoutClose={true} />
	) : null;
};