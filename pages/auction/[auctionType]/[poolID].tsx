import { useRouter } from "next/router";

import { POOL_TYPE } from "@app/api/pool/const";
import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { AuctionDetail } from "@app/pages/auction-detail";
import { pageWithLayout } from "@app/utils/pageInLayout";

const AuctionViewPage = pageWithLayout(
	() => {
		const {
			query: { auctionType, poolID },
		} = useRouter();

		return (
			<NoSsr>
				<RequireConnectedWallet>
					<AuctionDetail poolID={+poolID} auctionType={auctionType as POOL_TYPE} />
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

export default AuctionViewPage;
