import { SVGAttributes } from "react";

import { Tooltip } from "../tooltip";

import { Input } from "./Input";

const Icon = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg
			width={19}
			height={19}
			viewBox="0 0 19 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx={8} cy={8} r={7} stroke="#000" strokeWidth={2} />
			<path d="M12.5 12.5l5 5" stroke="#000" strokeWidth={2} />
		</svg>
	);
};

export const Default = () => (
	<div>
		<Input type="text" name="address" placeholder="0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c0000" />
	</div>
);

export const WithIcon = () => (
	<div>
		<Input
			type="text"
			name="address"
			placeholder="0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c0000"
			before={<Icon />}
		/>
	</div>
);

export const WithTooltip = () => (
	<div>
		<Input
			type="text"
			name="address"
			placeholder="0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c0000"
			after={<Tooltip size="small">Create new item</Tooltip>}
		/>
	</div>
);
