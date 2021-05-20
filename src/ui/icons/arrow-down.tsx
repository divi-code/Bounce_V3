import { SVGAttributes } from "react";

export const Arrow = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg
			width={18}
			height={11}
			viewBox="0 0 18 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M17 10L9 2l-8 8" stroke="#000" strokeWidth={2} />
		</svg>
	);
};
