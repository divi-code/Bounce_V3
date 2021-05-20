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
			<Select options={LIST} value="done" name="status" />
		</div>
	);
};

export const InitialValueWithPlaceholder = () => {
	return (
		<div>
			<Select options={LIST} placeholder="Choose OTC offer" value="done" name="status" />
		</div>
	);
};

export const ReadOnly = () => {
	return (
		<div>
			<Select options={LIST} placeholder="Choose OTC offer" value="done" name="status" readOnly />
		</div>
	);
};
