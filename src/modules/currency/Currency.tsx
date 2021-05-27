import classNames from "classnames";
import { CSSProperties, FC, useEffect, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Body1 } from "@app/ui/typography";

import { useTokenSearch } from "@app/web3/api/tokens";

import styles from "./Currency.module.scss";

export const CurrencyView: FC<{ symbol: string; img: string } & MaybeWithClassName> = ({
	className,
	symbol,
	img,
}) => {
	const [logoIsOk, setLogoIsOk] = useState(true);

	useEffect(() => {
		const testImage = new Image();
		testImage.onerror = () => setLogoIsOk(false);
		testImage.src = img;
	}, [img]);

	return (
		<Body1
			className={classNames(className, styles.component)}
			Component="span"
			style={logoIsOk ? ({ "--icon": `url(${img})` } as CSSProperties) : {}}
		>
			{symbol}
		</Body1>
	);
};

export const Currency: FC<MaybeWithClassName & { token: string }> = ({ token }) => {
	const findToken = useTokenSearch();

	const record = findToken(token);

	return token ? <CurrencyView symbol={token} img={record.logoURI} /> : null;
};
