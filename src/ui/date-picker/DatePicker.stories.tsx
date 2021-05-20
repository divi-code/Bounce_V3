import { useState } from "react";

import { useResizeObserver } from "@app/hooks/use-resize-observer";

import { DatePicker } from "./DatePicker";

export const Default = () => (
	<DatePicker
		label="Start"
		placeholder="From"
		name="date"
		min={new Date().toString()}
		onChange={() => null}
	/>
);

export const InitialValue = () => (
	<DatePicker
		label="Start"
		placeholder="From"
		name="date"
		min={new Date().toString()}
		initialValue={new Date()}
		onChange={() => null}
	/>
);

export const FloatWidth = () => {
	const [blockRef, setBlockRef] = useState<HTMLElement | null>(null);

	const [blockWidth, setBlockWidth] = useState(0);
	useResizeObserver(blockRef, (ref) => setBlockWidth(ref.clientWidth));

	return (
		<div ref={setBlockRef} style={{ width: 540 }}>
			<div
				style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridColumnGap: "20px" }}
			>
				<DatePicker
					label="Start"
					placeholder="From"
					name="date"
					min={new Date().toString()}
					onChange={() => null}
					dropdownWidth={`${blockWidth}px`}
				/>
				<DatePicker
					label="Start"
					placeholder="From"
					name="date"
					min={new Date().toString()}
					onChange={() => null}
					dropdownWidth={`${blockWidth}px`}
					dropdownPosition="right"
				/>
			</div>
		</div>
	);
};
