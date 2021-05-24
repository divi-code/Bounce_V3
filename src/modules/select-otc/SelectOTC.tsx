import { FC } from "react";

import { OTC_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { SelectField } from "@app/modules/select-field";

const LIST = [
	{
		label: OTC_NAME_MAPPING.sell,
		key: OTC_TYPE.sell,
	},
	{
		label: OTC_NAME_MAPPING.buy,
		key: OTC_TYPE.buy,
	},
];

export const SelectOTC: FC<{ required?: boolean; name: string }> = ({ required, name }) => {
	return (
		<SelectField name={name} placeholder="Choose Auction Type" options={LIST} required={required} />
	);
};
