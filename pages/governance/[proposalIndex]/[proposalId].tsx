import { useRouter } from "next/router";

import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { ProposalDetail } from "@app/pages/proposal-detail";
import { pageWithLayout } from "@app/utils/pageInLayout";

const ProposalViewPage = pageWithLayout(
	() => {
		const {
			query: { proposalIndex, proposalId },
		} = useRouter();

		return (
			<NoSsr>
				<RequireConnectedWallet>
					<ProposalDetail proposalIndex={+proposalIndex} proposalId={String(proposalId)} />
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

export default ProposalViewPage;