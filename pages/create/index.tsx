import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { Create } from "@app/pages/create";
import { pageWithLayout } from "@app/utils/pageInLayout";

const Index = pageWithLayout(
	() => (
		<NoSsr>
			<RequireConnectedWallet>
				<Create />
			</RequireConnectedWallet>
		</NoSsr>
	),
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default Index;
