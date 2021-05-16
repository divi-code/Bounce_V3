import { Layout } from "../src/layout";
import NoSsr from "../src/modules/no-ssr/NoSsr";
import { OTC } from "../src/pages/otc";
import { pageWithLayout } from "../src/utils/pageInLayout";

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
