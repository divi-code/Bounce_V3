import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Copy, Copied } from "@app/ui/icons/copy";
import { walletConversion } from "@app/utils/convertWallet";

import styles from "./CopyAddress.module.scss";

export const CopyAddress: FC<{ address: string } & MaybeWithClassName> = ({
	className,
	address,
}) => {
	const [isCopy, setCopy] = useState<boolean>(false);

	useEffect(() => {
		if (isCopy) {
			setTimeout(() => setCopy(false), 1000);
		}
	}, [isCopy]);

	return (
		<CopyToClipboard text={address} onCopy={() => setCopy(true)}>
			<span className={classNames(className, styles.component)}>
				{walletConversion(address)}
				{isCopy ? <Copied /> : <Copy />}
			</span>
		</CopyToClipboard>
	);
};
