import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowControl } from "@app/modules/flow/hooks";

import { ProvideAdvancedSettings } from "@app/modules/provide-advanced-settings";

type SettingsOutType = {
	poolName: string;
	startPool: string;
	endPool: string;
	whitelist: string;
};

const SettingsImp = () => {
	const { moveForward, addData } = useFlowControl<SettingsOutType>();

	const onSubmit = async (values: any) => {
		addData({
			poolName: values.poolName,
			startPool: values.startPool,
			endPool: values.endPool,
			whitelist: values.whitelist,
		});

		moveForward();
	};

	return <ProvideAdvancedSettings onSubmit={onSubmit} />;
};

export const Settings = defineFlowStep<{}, SettingsOutType, {}>({
	Body: SettingsImp,
});
