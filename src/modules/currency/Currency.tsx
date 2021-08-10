import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { GeckoCoin } from "@app/ui/icons/gecko-coin";
import { Body1, Caption } from "@app/ui/typography";

import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import { useTokenSearchWithFallback } from "@app/web3/api/tokens/use-fallback-tokens";

import { Icon } from "../icon";

import styles from "./Currency.module.scss";

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

export interface ICoin {
	address: string;
	coinGeckoID: string;
	currentPrice: number;
	decimals: number;
	name: string;
	symbol: string;
	thumbURL?: string;
	smallURL?: string;
	largeURL: string;
}

export const Currency: FC<
	MaybeWithClassName & { token?: string; coin?: ICoin; small?: boolean }
> = ({ token, coin, small }) => {
	const tokenInfo = useTokenSearchWithFallback(token) as any;
	const detail = coin || tokenInfo;
	const logoURI = detail?.thumbURL || detail?.smallURL || tokenInfo?.logoURI || undefined;

	if (!detail) {
		return null;
	}

	return <CurrencyView symbol={detail.symbol.toUpperCase()} img={logoURI} small={small} />;
};
