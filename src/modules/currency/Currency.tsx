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

const CurrencyToken: FC<ICurrencyProps> = ({ token, small }) => {
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

interface ICurrencyProps extends MaybeWithClassName {
	gecko?: boolean;
	token: string;
	small?: boolean;
}

export const Currency: FC<ICurrencyProps> = (props) => {
	const { token, small, gecko } = props;

	if (gecko) {
		return <CurrencyView symbol={token} img={GeckoCoin} small={small} />;
	}

	return <CurrencyToken {...props} />;
};
