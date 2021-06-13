import { FC } from "react";

import { OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateBuyingOTC } from "./CreateBuyingOTC";

export const CreateOTC: FC<MaybeWithClassName & { type: OTC_TYPE }> = ({ type }) => {
	switch (type) {
		case OTC_TYPE.buy:
			return <CreateBuyingOTC />;
		// case POOL_TYPE.sealed_bid:
		// 	return SEALED_STEPS;
	}
};
