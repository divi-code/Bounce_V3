import classNames from "classnames";

import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";
import { Button } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";
import { Body1, Heading1 } from "@app/ui/typography";

import styles from "./ConnectWalletBlock.module.scss";

export const ConnectWalletBlock: FC<MaybeWithClassName> = ({ className }) => {
	const { open } = useConnectWalletControl();

	return (
		<section className={classNames(className, styles.component)}>
			<GutterBox className={styles.wrapper}>
				<Heading1 className={styles.title}>Connect your wallet</Heading1>
				<Body1 className={styles.text}>
					The content of this page is only available with the connected wallet
				</Body1>
				<Button
					className={styles.button}
					color="primary-black"
					variant="contained"
					size="large"
					onClick={open}
				>
					Connect your wallet
				</Button>
			</GutterBox>
		</section>
	);
};
