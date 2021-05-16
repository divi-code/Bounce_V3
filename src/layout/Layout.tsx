import Head from "next/head";
import classNames from "classnames";
import { FC, ReactNode } from "react";

import styles from "./Layout.module.scss";
import { Web3ProviderRoot } from "../web3/provider/Web3Provider";

type LayoutType = {
	children?: ReactNode;
	title?: string;
	description?: string;
	keywords?: string;
	className?: string;
};

export const Layout: FC<LayoutType> = ({
	children,
	className,
	title = "",
	description = "",
	keywords,
}) => {
	return (
		<div className={classNames(styles.component, className)}>
			<Head>
				<title>{title}</title>
				<meta name="Description" content={description} />
				<meta name="keywords" content={keywords} />
			</Head>
			<header className={styles.header} />
			<main className={styles.main}>
				<Web3ProviderRoot>
					<>
						<div className={styles.desktop}>{children}</div>
						<div className={styles.mobile}>
							Sorry, this event is unavailable on mobile. Please visit our desktop website to
							participate.
						</div>
					</>
				</Web3ProviderRoot>
			</main>
			<footer />
		</div>
	);
};
