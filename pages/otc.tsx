import { pageWithLayout } from "../src/utils/pageInLayout";
import { Layout } from "../src/layout";
import NoSsr from "../src/modules/no-ssr/NoSsr";
import { OTC } from "../src/pages/otc";

const Index = pageWithLayout(
	() => (
		<NoSsr>
			<OTC />
		</NoSsr>
	),
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default Index;
