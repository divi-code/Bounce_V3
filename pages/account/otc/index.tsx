import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { Account } from "@app/pages/account";
import { pageWithLayout } from "@app/utils/pageInLayout";

const OTCPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<RequireConnectedWallet>
					<Account type="otc" />
				</RequireConnectedWallet>
			</NoSsr>
		);
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default OTCPage;
