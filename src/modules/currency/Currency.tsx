import classNames from "classnames";
import { CSSProperties, FC, useEffect, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Body1, Caption } from "@app/ui/typography";

import { useTokenSearch } from "@app/web3/api/tokens";

import styles from "./Currency.module.scss";

type CurrencyType = {
	symbol: string;
	img: string;
};

export const CurrencyView: FC<{ small?: boolean } & CurrencyType & MaybeWithClassName> = ({
	className,
	symbol,
	img,
	small,
}) => {
	const [logoIsOk, setLogoIsOk] = useState(true);

	useEffect(() => {
		const testImage = new Image();
		testImage.onerror = () => setLogoIsOk(false);
		testImage.src = img;
	}, [img]);

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

	const record = findToken(token);

	return token ? <CurrencyView symbol={token} img={record.logoURI} small={small} /> : null;
};
