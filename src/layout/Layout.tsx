import classNames from "classnames";
import Head from "next/head";
import { FC, ReactNode } from "react";

import { Header } from "@app/modules/header";

import { Web3ProviderRoot } from "../web3/provider/Web3Provider";

import styles from "./Layout.module.scss";

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
		<Web3ProviderRoot>
			<div className={classNames(styles.component, className)}>
				<Head>
					<title>{title}</title>
					<meta name="Description" content={description} />
					<meta name="keywords" content={keywords} />
				</Head>
				<Header className={styles.header} />
				<main className={styles.main}>
					<div className={styles.desktop}>{children}</div>
					<div className={styles.mobile}>
						Sorry, this event is unavailable on mobile. Please visit our desktop website to
						participate.
					</div>
				</main>
				<footer />
			</div>
		</Web3ProviderRoot>
	);
};
