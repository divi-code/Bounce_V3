import { SVGAttributes } from "react";

export const Close = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg
			width={40}
			height={40}
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M29.697 29.698L9.898 9.9M9.9 29.698L29.7 9.9"
				stroke="currentColor"
				strokeWidth={2}
			/>
		</svg>
	);
};
