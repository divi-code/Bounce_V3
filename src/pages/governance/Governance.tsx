import { useState } from "react";

import { GovernanceView } from "@app/pages/governance/GovernanceView";

export const Governance = () => {
	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	return <GovernanceView />;
};
