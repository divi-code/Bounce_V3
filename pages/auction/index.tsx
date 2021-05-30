import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { Auction } from "@app/pages/auction";
import { pageWithLayout } from "@app/utils/pageInLayout";

const AuctionPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<Auction />
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
