import { FC } from "react";

export type PageWithLayout<T extends {}> = FC & {
	layout: FC;
	getInitialProps?(): Promise<T>;
};

/**
 * connects Page, PageLayout and getInitialProps
 * @param pageComponent
 * @param layout
 */

export const pageWithLayout = <T extends {}>(
	pageComponent: FC<T>,
	layout: FC
): PageWithLayout<T> => {
	const page: any = pageComponent;
	page.layout = layout;

	return page;
};
