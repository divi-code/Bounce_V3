import { POOL_TYPE } from "@app/api/pool/const";

import { CreateAuction } from "./CreateAuction";

export const Default = () => {
	return (
		<div>
			<CreateAuction type={POOL_TYPE.fixed} />
		</div>
	);
};
