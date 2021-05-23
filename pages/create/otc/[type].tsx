import { useRouter } from "next/router";

import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { pageWithLayout } from "@app/utils/pageInLayout";

const OTCPage = pageWithLayout(
	() => {
		const router = useRouter();
		const { type } = router.query;

		return <NoSsr>otc {type}</NoSsr>;
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default OTCPage;
