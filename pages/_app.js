import { Component, FC } from "react";
import "../src/theme/globals.scss";
import "../src/theme/variables.scss";

const FragmentLayout = ({ children }) => <>{children}</>;

const MyApp = ({ Component, pageProps }) => {
	const layout = "layout" in Component ? Component.layout : FragmentLayout;

	return layout({ children: <Component {...pageProps} /> });
};

export default MyApp;
