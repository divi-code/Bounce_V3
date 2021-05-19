import { DatePicker } from "./DatePicker";

export const Default = () => (
	<DatePicker
		calenderLabel="Start"
		label="From"
		name="date"
		initialValue={new Date("2021-05-18")}
		onValueChange={() => null}
	/>
);
