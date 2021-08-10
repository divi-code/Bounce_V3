import classNames from "classnames";
import React, { FC } from "react";

import { IToken } from "@app/api/types";
import { MaybeWithClassName } from "@app/helper/react/types";
import { Body1, Caption } from "@app/ui/typography";

import { useTokenSearchWithFallback } from "@app/web3/api/tokens/use-fallback-tokens";

import { Icon } from "../icon";

import styles from "./Currency.module.scss";
import GeckoCoin from "./assets/gecko-coin.svg";
import UnknowCoin from "./assets/unknow-coin.svg";

type CurrencyType = {
	symbol: string;
	img?: React.ReactNode;
};

export const CurrencyView: FC<{ small?: boolean } & CurrencyType & MaybeWithClassName> = ({
	className,
	symbol,
	img,
	small,
}) => {
	return small ? (
		<Caption className={classNames(className, styles.component, styles.small)} Component="span">
			<Icon src={img} />
			{symbol}
		</Caption>
	) : (
		<Body1 className={classNames(className, styles.component)} Component="span">
			{symbol}
		</Body1>
	);
};

export const Currency: FC<
	MaybeWithClassName & { token?: string; coin?: IToken; small?: boolean }
> = ({ token, coin, small }) => {
	const tokenInfo = useTokenSearchWithFallback(token) as any;
	const detail = coin || tokenInfo;
	const logoURI = detail?.thumbURL || detail?.smallURL || tokenInfo?.logoURI || undefined;

	if (!detail) {
		return null;
	}

	return <CurrencyView symbol={detail.symbol.toUpperCase()} img={logoURI} small={small} />;
};

export interface IGeckoTokenProps extends MaybeWithClassName {
	isGecko: boolean;
	token: string;
}

export const GeckoToken: FC<IGeckoTokenProps> = ({ isGecko = true, token, className }) => {
	return (
		<Caption className={classNames(className, styles.component, styles.small)} Component="span">
			<Icon src={isGecko ? GeckoCoin : UnknowCoin} />
			{token}
		</Caption>
	);
};
