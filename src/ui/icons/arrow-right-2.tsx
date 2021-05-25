import { SVGAttributes } from "react";

export const RightArrow2 = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M0 6h16m0 0l-5 5m5-5l-5-5" stroke="currentColor" strokeWidth={1.5} />
		</svg>
	);
};
