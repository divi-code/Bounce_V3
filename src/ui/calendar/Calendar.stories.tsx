import { Calendar } from "./Calendar";
import { DayPanelHead } from "./DayPanelHead";
import { DayPanelImpl } from "./Days";
import { generateDays } from "./utils";

const nope = () => null;

export const Default = () => (
	<Calendar
		label="Choose end date"
		quickNav={["in-5-days", "in-7-days", "in-10-days"]}
		selection={{}}
		onChange={nope}
		minDate={new Date("2012")}
		maxDate={new Date()}
		style={{ width: 540 }}
		gap="20px"
	/>
);

export const PanelHead = () => <DayPanelHead />;

export const DayPanel = () => (
	<DayPanelImpl
		month={1}
		day={23}
		pickDate={nope}
		days={generateDays(1, 2020)}
		selection={{
			start: new Date(2020, 1, 10),
			end: new Date(2020, 1, 20),
		}}
		from={new Date(2020, 1, 5)}
		to={new Date(2020, 1, 17)}
	/>
);
