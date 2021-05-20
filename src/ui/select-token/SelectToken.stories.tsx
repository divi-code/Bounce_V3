import { SelectToken } from "./SelectToken";

export const Default = () => <SelectToken placeholder="From" name="date" onChange={() => null} />;

export const InitialValue = () => (
	<SelectToken placeholder="From" name="date" value="eth7" onChange={() => null} />
);
