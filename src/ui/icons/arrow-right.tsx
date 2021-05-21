import { SVGAttributes } from "react";

export const RightArrow = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M0 12l1.333 1.333L8 6.666 1.333 0 0 1.333l5.333 5.333L0 12z" fill="currentColor" />
		</svg>
	);
};
