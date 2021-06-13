import { FC } from "react";

import { OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateBuyingOTC } from "./CreateBuyingOTC";
import { CreateSellingOTC } from "./CreateSellingOTC";

export const CreateOTC: FC<MaybeWithClassName & { type: OTC_TYPE }> = ({ type }) => {
	switch (type) {
		case OTC_TYPE.buy:
			return <CreateBuyingOTC />;
		case OTC_TYPE.sell:
			return <CreateSellingOTC />;
	}
};
