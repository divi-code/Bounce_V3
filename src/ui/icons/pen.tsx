import { SVGAttributes } from "react";

export const Pen = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.5 14.929l-1.768 5.303 5.304-1.767L5.5 14.929zm4.243 2.828l-3.536-3.535 9.9-9.9 3.535 3.536-9.9 9.9zM20.349 7.151l-3.535-3.536 2.121-2.121 3.536 3.535-2.122 2.122z"
				fill="currentColor"
			/>
		</svg>
	);
};
