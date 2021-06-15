import { Calendar } from "./Calendar";
import { DayPanelHead } from "./DayPanelHead";
import { DayPanelImpl } from "./Days";
import { generateDays, stripHours } from "./utils";

const nope = () => null;

export const Default = () => (
	<Calendar
		selection={{}}
		onChange={nope}
		minDate={stripHours(new Date())}
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
		from={new Date(2020, 1, 5)}
		to={new Date(2020, 1, 17)}
	/>
);

export const Selection = () => (
	<DayPanelImpl
		month={1}
		day={10}
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
