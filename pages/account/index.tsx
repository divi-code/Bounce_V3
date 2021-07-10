import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { Account } from "@app/pages/account";
import { pageWithLayout } from "@app/utils/pageInLayout";

const AuctionPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<RequireConnectedWallet>
					<Account type="auction" />
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

export default AuctionPage;
