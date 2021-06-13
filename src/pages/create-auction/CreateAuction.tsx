import { FC } from "react";

import { POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateFixedAuction } from "@app/pages/create-auction/CreateFixedAuction";

export const CreateAuction: FC<MaybeWithClassName & { type: POOL_TYPE }> = ({ type }) => {
	switch (type) {
		case POOL_TYPE.fixed:
			return <CreateFixedAuction />;
		// case POOL_TYPE.sealed_bid:
		// 	return SEALED_STEPS;
		// case POOL_TYPE.english:
		// 	return DUTCH_STEPS;
		// case POOL_TYPE.dutch:
		// 	return ENGLISH_STEPS;
		// case POOL_TYPE.lottery:
		// 	return LOTTERY_STEPS;
	}
};
