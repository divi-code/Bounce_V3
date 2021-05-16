import { pageWithLayout } from "../src/utils/pageInLayout";
import { Layout } from "../src/layout";
import { Auction } from "../src/pages/auction";
import NoSsr from "../src/modules/no-ssr/NoSsr";

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
