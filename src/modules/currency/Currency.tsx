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

interface ICurrencyViewProps extends MaybeWithClassName {
	symbol?: string;
	img?: React.ReactNode;
	cacheKey?: string;
	small?: boolean;
}

export const CurrencyView: FC<ICurrencyViewProps> = ({
	className,
	symbol,
	img,
	small,
	cacheKey,
}) => {
	return small ? (
		<Caption className={classNames(className, styles.component, styles.small)} Component="span">
			<Icon src={img} cacheKey={cacheKey} />
			{symbol}
		</Caption>
	) : (
		<Body1 className={classNames(className, styles.component)} Component="span">
			{symbol}
		</Body1>
	);
};

interface ICurrencyProps extends ICurrencyViewProps {
	coin?: IToken;
	token?: string;
}

export const Currency: FC<ICurrencyProps> = ({ token, coin, small }) => {
	const detail = useTokenSearchWithFallback(token || coin.address, coin) as any;
	const logoURI = detail?.logoURI || detail?.thumbURL || detail?.smallURL || undefined;

	if (!detail) {
		return null;
	}

	return (
		<CurrencyView
			cacheKey={detail.address}
			symbol={detail?.symbol?.toUpperCase()}
			img={logoURI}
			small={small}
		/>
	);
};

export interface IGeckoTokenProps extends MaybeWithClassName {
	isGecko: boolean;
	token: string;
	cacheKey?: string;
}

export const GeckoToken: FC<IGeckoTokenProps> = ({
	cacheKey,
	isGecko = true,
	token,
	className,
}) => {
	return (
		<Caption className={classNames(className, styles.component, styles.small)} Component="span">
			<Icon cacheKey={cacheKey} src={isGecko ? GeckoCoin : UnknowCoin} />
			{token}
		</Caption>
	);
};
