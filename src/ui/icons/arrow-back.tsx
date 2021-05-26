import { SVGAttributes } from "react";

export const ArrowBack = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M12.8 1L2 11m0 0l10.8 10M2 11h24" stroke="currentColor" strokeWidth={2} />
		</svg>
	);
};
