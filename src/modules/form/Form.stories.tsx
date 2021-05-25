import { useState } from "react";

import { useResizeObserver } from "@app/hooks/use-resize-observer";
import { CheckboxField } from "@app/modules/checkbox-field";
import { DateField } from "@app/modules/date-field";
import { Label } from "@app/modules/label";
import { PoolSearchField } from "@app/modules/pool-search-field";
import { RadioField } from "@app/modules/radio-field";
import { SelectField } from "@app/modules/select-field";
import { SelectTokenField } from "@app/modules/select-token-field";
import { TextField } from "@app/modules/text-field";
import { PopupTeleporterTarget } from "@app/ui/pop-up-container";
import { RadioGroup } from "@app/ui/radio-group";

import { Form } from "./Form";

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

export const FinalFormIntegration = () => {
	const [blockRef, setBlockRef] = useState<HTMLElement | null>(null);

	const [blockWidth, setBlockWidth] = useState(0);
	useResizeObserver(blockRef, (ref) => setBlockWidth(ref.clientWidth));

	return (
		<div>
			<Form
				onSubmit={() => null}
				initialValues={{
					"auction-type": "otc",
					apply: ["minimal-bid-price"],
					"auction-status": "done",
				}}
			>
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
				<Label Component="div" label="Select token" style={{ marginBottom: 40 }}>
					<SelectTokenField name="token-type" placeholder="Status a token" />
				</Label>
				<Label Component="div" label="Pool Information" style={{ marginBottom: 40 }}>
					<PoolSearchField placeholder="Pool Information (optional)" name="pool" />
				</Label>
				<div ref={setBlockRef} style={{ width: 540, marginBottom: 40 }}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(2, 1fr)",
							alignItems: "start",
							gridColumnGap: "20px",
						}}
					>
						<Label Component="div" label="Start Time">
							<DateField
								placeholder="10.01.2021"
								name="start-time"
								min={new Date().toString()}
								dropdownWidth={`${blockWidth}px`}
								label="Choose start date"
								quickNav={["today", "tomorrow", "in-2-days"]}
							/>
						</Label>
						<Label Component="label" label="End Time">
							<DateField
								placeholder="10.01.2021"
								name="end-time"
								min={new Date().toString()}
								dropdownWidth={`${blockWidth}px`}
								dropdownPosition="right"
								label="Choose end date"
								quickNav={["in-5-days", "in-7-days", "in-10-days"]}
							/>
						</Label>
					</div>
				</div>
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
				<CheckboxField name="apply" label="Minimal Bid Price Increment" value="minimal-bid-price" />
			</Form>
			<PopupTeleporterTarget />
		</div>
	);
};
