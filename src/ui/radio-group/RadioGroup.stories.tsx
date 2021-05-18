import { Radio } from "../radio";

import { RadioGroup } from "./RadioGroup";

export const Default = () => (
	<div>
		<RadioGroup count={2}>
			<Radio name="type" value="1" checked>
				Auction
			</Radio>
			<Radio name="type" value="1">
				Auction
			</Radio>
		</RadioGroup>
	</div>
);
