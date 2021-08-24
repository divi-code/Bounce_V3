import Head from "next/head";
import { Component, FC } from "react";
import "../src/theme/globals.scss";
import "../src/theme/variables.scss";

const FragmentLayout = ({ children }) => <>{children}</>;

const MyApp = ({ Component, pageProps }) => {
	const layout = "layout" in Component ? Component.layout : FragmentLayout;

	return layout({
		children: (
			<>
				<Head>
					<title>Bounce</title>
				</Head>
				<Component {...pageProps} />
			</>
		),
	});
};

export default MyApp;
