import { Radio } from "./Radio";

export const Default = () => (
	<div>
		<Radio name="type" value="1">
			Auction
		</Radio>
	</div>
);

export const Checked = () => (
	<div>
		<Radio name="type" value="1" checked>
			Auction
		</Radio>
	</div>
);

export const WithTooltip = () => (
	<div>
		<Radio name="type" value="1" tooltip="Create new item">
			Auction
		</Radio>
	</div>
);
