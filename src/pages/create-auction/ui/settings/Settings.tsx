import { useMemo } from "react";

import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl } from "@app/modules/flow/hooks";

import { ProvideAdvancedSettings, WHITELIST_TYPE } from "@app/modules/provide-advanced-settings";

export type SettingsOutType = {
	poolName: string;
	startPool: string;
	endPool: string;
	delayClaim: boolean;
	claimStart: string;
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
			endPool: values.endPool,
			delayClaim: values.delayToken.length > 0,
			claimStart: values.delayToken.length > 0 ? values.claimStart : values.endPool,
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
			delayToken: ["unlock"],
			whitelist: WHITELIST_TYPE.no,
			...data.settingsFormValues,
		}),
		[data.settingsFormValues]
	);

	return <ProvideAdvancedSettings onSubmit={onSubmit} initialValues={initialValues} />;
};

export const Settings = defineFlowStep<{}, SettingsOutType, {}>({
	Body: SettingsImp,
});
