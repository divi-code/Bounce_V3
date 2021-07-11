import { SVGAttributes } from "react";

export const Plus = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path fill="currentColor" d="M10 0h5v5h-5zM0 10h15v5H0z" />
			<path fill="currentColor" d="M5 20V5h5v15z" />
		</svg>
	);
};
