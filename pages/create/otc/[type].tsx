import { useRouter } from "next/router";

import { OTC_TYPE } from "@app/api/otc/const";
import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { CreateOTC } from "@app/pages/create-otc";
import { pageWithLayout } from "@app/utils/pageInLayout";

const OTCPage = pageWithLayout(
	() => {
		const router = useRouter();
		const { type } = router.query;

		return (
			<NoSsr>
				<RequireConnectedWallet>
					<CreateOTC type={type as OTC_TYPE} />
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
