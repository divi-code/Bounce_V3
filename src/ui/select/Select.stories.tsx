import { Select } from "./Select";

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

export const Default = () => {
	return (
		<div>
			<Select options={LIST} name="status" />
		</div>
	);
};

export const Placeholder = () => {
	return (
		<div>
			<Select options={LIST} placeholder="Choose OTC offer" name="status" />
		</div>
	);
};

export const InitialValue = () => {
	return (
		<div>
			<Select options={LIST} initialValue="done" name="status" />
		</div>
	);
};

export const InitialValueWithPlaceholder = () => {
	return (
		<div>
			<Select options={LIST} placeholder="Choose OTC offer" initialValue="done" name="status" />
		</div>
	);
};
