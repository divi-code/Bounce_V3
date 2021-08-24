import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { Governance } from "@app/pages/governance";

import { pageWithLayout } from "@app/utils/pageInLayout";

const GovernancePage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<Governance />
			</NoSsr>
		);
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default GovernancePage;
