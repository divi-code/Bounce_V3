import { Layout } from "../src/layout";
import NoSsr from "../src/modules/no-ssr/NoSsr";
import { Auction } from "../src/pages/auction";
import { pageWithLayout } from "../src/utils/pageInLayout";

const Index = pageWithLayout(
	() => (
		<NoSsr>
			<Auction />
		</NoSsr>
	),
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default Index;
