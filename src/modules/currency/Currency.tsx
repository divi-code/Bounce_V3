import classNames from "classnames";
import { CSSProperties, FC, useEffect, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Body1, Caption } from "@app/ui/typography";

import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import { useTokenSearchWithFallback } from "@app/web3/api/tokens/use-fallback-tokens";

import styles from "./Currency.module.scss";
import EMPTY from "./assets/empty.svg";

type CurrencyType = {
	symbol: string;
	img?: string;
};

export const CurrencyView: FC<{ small?: boolean } & CurrencyType & MaybeWithClassName> = ({
	className,
	symbol,
	img,
	small,
}) => {
	const [logoIsOk, setLogoIsOk] = useState(true);

	const realImage = img ? uriToHttp(img)[0] : undefined;

	useEffect(() => {
		if (realImage) {
			const testImage = new Image();
			testImage.onerror = () => setLogoIsOk(false);
			testImage.src = realImage;
		}
	}, [realImage]);

	return small ? (
		<Caption
			className={classNames(className, styles.component, styles.small)}
			Component="span"
			style={{ "--icon": img && logoIsOk ? `url(${img})` : `url(${EMPTY})` } as CSSProperties}
		>
			{symbol}
		</Caption>
	) : (
		<Body1
			className={classNames(className, styles.component)}
			Component="span"
			style={{ "--icon": img && logoIsOk ? `url(${img})` : `url(${EMPTY})` } as CSSProperties}
		>
			{symbol}
		</Body1>
	);
};

export const Currency: FC<MaybeWithClassName & { token: string; small?: boolean }> = ({
	token,
	small,
}) => {
	const tokenInfo = useTokenSearchWithFallback(token);

	if (!tokenInfo) {
		return null;
	}

	return (
		<CurrencyView
			symbol={tokenInfo.symbol}
			img={tokenInfo ? tokenInfo.logoURI : undefined}
			small={small}
		/>
	);
};
