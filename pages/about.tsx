import { Layout } from "../src/layout";
import NoSsr from "../src/modules/no-ssr/NoSsr";
import { About } from "../src/pages/about";
import { pageWithLayout } from "../src/utils/pageInLayout";

const Index = pageWithLayout(
	() => (
		<NoSsr>
			<About />
		</NoSsr>
	),
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default Index;
