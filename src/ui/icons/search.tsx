import { SVGAttributes } from "react";

export const Search = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<circle cx={8} cy={8} r={7} stroke="#000" strokeWidth={2} />
			<path d="M12.5 12.5l5 5" stroke="#000" strokeWidth={2} />
		</svg>
	);
};
