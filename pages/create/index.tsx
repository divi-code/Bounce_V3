import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { pageWithLayout } from "@app/utils/pageInLayout";

const Index = pageWithLayout(
	() => <NoSsr>CREATE</NoSsr>,
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default Index;
