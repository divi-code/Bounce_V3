import { FC } from "react";

import { POOL_NAME_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { CreateFlow } from "@app/modules/create-flow";
import { defineFlow } from "@app/modules/flow/definition";

import styles from "./CreateAuction.module.scss";
import { Confirmation } from "./ui/confirmation";
// import { Dutch } from "./ui/dutch";
// import { English } from "./ui/english";
import { Fixed } from "./ui/fixed";
// import { Lottery } from "./ui/lottery";
// import { SealedBid } from "./ui/sealed-bid";
import { Settings } from "./ui/settings";
import { Token } from "./ui/token";

const FIXED_STEPS = defineFlow(Token, Fixed, Settings, Confirmation);
// const SEALED_STEPS = defineFlow(Token, SealedBid, Settings, Confirmation);
// const DUTCH_STEPS = defineFlow(Token, Dutch, Settings, Confirmation);
// const ENGLISH_STEPS = defineFlow(Token, English, Settings, Confirmation);
// const LOTTERY_STEPS = defineFlow(Token, Lottery, Settings, Confirmation);

export const CreateAuction: FC<MaybeWithClassName & { type: POOL_TYPE }> = ({ type }) => {
	const getStepsByType = (pool: POOL_TYPE) => {
		switch (pool) {
			case POOL_TYPE.fixed:
				return FIXED_STEPS;
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

	return (
		<div className={styles.component}>
			<CreateFlow
				type={POOL_NAME_MAPPING[type]}
				steps={getStepsByType(type)}
				onComplete={() => alert("Complete")}
			/>
		</div>
	);
};
