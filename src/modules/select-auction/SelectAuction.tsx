import { FC } from "react";

import { POOL_NAME_MAPPING, POOL_TYPE } from "@app/api/pool/const";
import { SelectField } from "@app/modules/select-field";

const LIST = [
	{
		label: POOL_NAME_MAPPING.fixed,
		key: POOL_TYPE.fixed,
	},
	// {
	// 	label: POOL_NAME_MAPPING.sealed_bid,
	// 	key: POOL_TYPE.sealed_bid,
	// },
	// {
	// 	label: POOL_NAME_MAPPING.english,
	// 	key: POOL_TYPE.english,
	// },
	// {
	// 	label: POOL_NAME_MAPPING.dutch,
	// 	key: POOL_TYPE.dutch,
	// },
	// {
	// 	label: POOL_NAME_MAPPING.lottery,
	// 	key: POOL_TYPE.lottery,
	// },
];

export const SelectAuction: FC<{ required?: boolean; name: string }> = ({ required, name }) => {
	return (
		<SelectField name={name} placeholder="Choose Auction Type" options={LIST} required={required} />
	);
};
