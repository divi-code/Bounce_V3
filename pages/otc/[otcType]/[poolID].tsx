import { useRouter } from "next/router";

import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { OTCDetail } from "@app/pages/otc-detail";
import { pageWithLayout } from "@app/utils/pageInLayout";

const OtcViewPage = pageWithLayout(
	() => {
		const {
			query: { poolID },
		} = useRouter();

		return (
			<NoSsr>
				<RequireConnectedWallet>
					<OTCDetail poolID={+poolID} />
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

export default OtcViewPage;
