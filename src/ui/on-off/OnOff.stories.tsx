import { OnOff } from "./OnOff";

export const Default = () => (
	<div>
		<OnOff name="type" value="1" />
	</div>
);

export const Checked = () => (
	<div>
		<OnOff name="type" value="1" checked />
	</div>
);
