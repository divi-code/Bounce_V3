import { Form } from "react-final-form";

import { CheckboxField } from "@app/modules/checkbox-field";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { TextField } from "@app/modules/text-field";
import { RadioGroup } from "@app/ui/radio-group";

export const FinalFormIntegration = () => (
	<div>
		<Form
			onSubmit={() => null}
			initialValues={{ "auction-type": "otc", apply: ["minimal-bid-price"] }}
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
					<Label Component="label" label="Select Creation Type" style={{ marginBottom: 40 }}>
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
