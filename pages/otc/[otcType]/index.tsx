import { OTC_TYPE } from "@app/api/otc/const";
import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { OTC } from "@app/pages/otc";
import { pageWithLayout } from "@app/utils/pageInLayout";

const OTCPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<OTC />
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

	if (![OTC_TYPE.buy, OTC_TYPE.sell].includes(auctionType)) {
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
		paths: [{ params: { auctionType: OTC_TYPE.buy } }, { params: { auctionType: OTC_TYPE.sell } }],
		fallback: false,
	};
}

export default OTCPage;
