import { SVGAttributes } from "react";

export const Toggle = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg
			width={24}
			height={10}
			viewBox="0 0 24 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path fill="currentColor" d="M0 0h24v1H0zM0 9h24v1H0z" />
		</svg>
	);
};
