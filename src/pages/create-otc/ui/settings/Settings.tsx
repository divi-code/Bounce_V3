import { useMemo } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl } from "@app/modules/flow/hooks";

import {
	ProvideAdvancedSettingsForOTC,
	WHITELIST_TYPE,
} from "@app/modules/provide-advanced-settings-for-otc";

export type SettingsOutType = {
	poolName: string;
	startPool: string;
	whitelist: boolean;
	whiteListList: string[] | undefined;
	settingsFormValues: any;
};

const SettingsImp = () => {
	const { moveForward, addData, data } = useFlowControl<SettingsOutType>();

	const onSubmit = async (values: any) => {
		addData({
			poolName: values.poolName,
			startPool: values.startPool,
			whitelist: values.whitelist === WHITELIST_TYPE.yes,
			whiteListList:
				values.whitelist === WHITELIST_TYPE.yes && values.whiteListList.length > 0
					? values.whiteListList
					: undefined,
			settingsFormValues: values,
		});

		moveForward();
	};

	const initialValues = useMemo(
		() => ({
			whitelist: WHITELIST_TYPE.no,
			...data.settingsFormValues,
		}),
		[data.settingsFormValues]
	);

	return <ProvideAdvancedSettingsForOTC onSubmit={onSubmit} initialValues={initialValues} />;
};

export const Settings = defineFlowStep<{}, SettingsOutType, {}>({
	Body: SettingsImp,
});
