import { useRouter } from "next/router";

import { POOL_TYPE } from "@app/api/pool/const";
import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { CreateAuction } from "@app/pages/create-auction";
import { pageWithLayout } from "@app/utils/pageInLayout";

const AuctionPage = pageWithLayout(
	() => {
		const router = useRouter();
		const { type } = router.query;

		return (
			<NoSsr>
				<CreateAuction type={type as POOL_TYPE} />
			</NoSsr>
		);
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export function getStaticProps(context) {
	const { type } = context.params;

	if (
		![
			POOL_TYPE.fixed,
			POOL_TYPE.sealed_bid,
			POOL_TYPE.dutch,
			POOL_TYPE.english,
			POOL_TYPE.lottery,
		].includes(type)
	) {
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
		paths: [
			{ params: { type: POOL_TYPE.fixed } },
			{ params: { type: POOL_TYPE.sealed_bid } },
			{ params: { type: POOL_TYPE.dutch } },
			{ params: { type: POOL_TYPE.english } },
			{ params: { type: POOL_TYPE.lottery } },
		],
		fallback: false,
	};
}

export default AuctionPage;
