import { useRouter } from "next/router";

import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { pageWithLayout } from "@app/utils/pageInLayout";

const AuctionPage = pageWithLayout(
	() => {
		const router = useRouter();
		const { type } = router.query;

		return <NoSsr>auction {type}</NoSsr>;
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export function getStaticProps(context) {
	const { type } = context.params;

	if (!["fixed"].includes(type)) {
		return {
			props: {},
			notFound: true,
		};
	}

	return {
		props: {},
	};
}

export async function getStaticPaths() {
	return {
		paths: [{ params: { type: "fixed" } }],
		fallback: false,
	};
}

export default AuctionPage;
