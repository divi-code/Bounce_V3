import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Copy, Copied } from "@app/ui/icons/copy";
// import { walletConversion } from "@app/utils/convertWallet";

import styles from "./CopyAddress.module.scss";

export const CopyAddress: FC<{ address: string; labelAddress?: string } & MaybeWithClassName> = ({
	className,
	address,
	labelAddress,
}) => {
	const [isCopy, setCopy] = useState<boolean>(false);

	useEffect(() => {
		if (isCopy) {
			setTimeout(() => setCopy(false), 1000);
		}
	}, [isCopy]);

	return (
		<span className={classNames(className, styles.component)}>
			{labelAddress || address}
			<CopyToClipboard text={address} onCopy={() => setCopy(true)}>
				{isCopy ? <Copied /> : <Copy className={styles.copy} />}
			</CopyToClipboard>
		</span>
	);
};
