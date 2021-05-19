import { Form } from "react-final-form";

import { CheckboxField } from "@app/modules/checkbox-field";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { SelectField } from "@app/modules/select-field";
import { TextField } from "@app/modules/text-field";
import { RadioGroup } from "@app/ui/radio-group";

const LIST = [
	{
		label: "In progress",
		key: "progress",
	},
	{
		label: "Re-Open",
		key: "reOpen",
	},
	{
		label: "Closed",
		key: "done",
	},
];

export const FinalFormIntegration = () => (
	<div>
		<Form
			onSubmit={() => null}
			initialValues={{
				"auction-type": "otc",
				apply: ["minimal-bid-price"],
				"auction-status": "done",
			}}
		>
			{(sub) => (
				<form onSubmit={sub.handleSubmit}>
					<Label Component="label" label="Token contact address" style={{ marginBottom: 40 }}>
						<TextField
							name="address"
							type="text"
							placeholder="0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c0000"
						/>
					</Label>
					<Label Component="div" label="Select status" style={{ marginBottom: 40 }}>
						<SelectField name="auction-status" placeholder="Status" options={LIST} />
					</Label>
					<Label Component="div" label="Select Creation Type" style={{ marginBottom: 40 }}>
						<RadioGroup count={2}>
							<RadioField
								name="auction-type"
								label="Auction"
								value="auction"
								tooltip="Create new item"
							/>
							<RadioField name="auction-type" label="OTC" value="otc" />
						</RadioGroup>
					</Label>
					<CheckboxField
						name="apply"
						label="Minimal Bid Price Increment"
						value="minimal-bid-price"
					/>
				</form>
			)}
		</Form>
	</div>
);
