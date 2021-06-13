import classNames from "classnames";
import { CSSProperties, FC, useDebugValue, useEffect, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Body1, Caption } from "@app/ui/typography";

import { useTokenSearch } from "@app/web3/api/tokens";

import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import styles from "./Currency.module.scss";

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
			style={logoIsOk ? ({ "--icon": `url(${img})` } as CSSProperties) : {}}
		>
			{symbol}
		</Caption>
	) : (
		<Body1
			className={classNames(className, styles.component)}
			Component="span"
			style={logoIsOk ? ({ "--icon": `url(${img})` } as CSSProperties) : {}}
		>
			{symbol}
		</Body1>
	);
};

export const Currency: FC<MaybeWithClassName & { token: string; small?: boolean }> = ({
	token,
	small,
}) => {
	const findToken = useTokenSearch();
	const tokenInfo = findToken(token);

	if (!token) {
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
