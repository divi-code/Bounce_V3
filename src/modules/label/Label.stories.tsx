import { Input } from "../../ui/input";

import { Label } from "./Label";

export const Default = () => (
	<div>
		<Label Component="label" label="Payment Currency">
			<Input name="currency" type="text" placeholder="Select a token you want to pay" />
		</Label>
	</div>
);

export const WithTooltip = () => (
	<div>
		<Label Component="label" label="Payment Currency" tooltip="Create new item">
			<Input name="currency" type="text" placeholder="Select a token you want to pay" />
		</Label>
	</div>
);
