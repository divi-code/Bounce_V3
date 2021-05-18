import { Checkbox } from "./Checkbox";

export const Default = () => (
	<div>
		<Checkbox name="type" value="1">
			Auction
		</Checkbox>
	</div>
);

export const Checked = () => (
	<div>
		<Checkbox name="type" value="1" checked>
			Auction
		</Checkbox>
	</div>
);
