import { POOL_TYPE } from "@app/api/pool/const";
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

export function getStaticProps(context) {
	const { auctionType } = context.params;

	if (
		![
			POOL_TYPE.fixed,
			POOL_TYPE.sealed_bid,
			POOL_TYPE.dutch,
			POOL_TYPE.english,
			POOL_TYPE.lottery,
		].includes(auctionType)
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
			{ params: { auctionType: POOL_TYPE.fixed } },
			{ params: { auctionType: POOL_TYPE.sealed_bid } },
			{ params: { auctionType: POOL_TYPE.dutch } },
			{ params: { auctionType: POOL_TYPE.english } },
			{ params: { auctionType: POOL_TYPE.lottery } },
		],
		fallback: false,
	};
}

export default AuctionPage;
