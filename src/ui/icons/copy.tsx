import { SVGAttributes } from "react";

export const Copy = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7 4.75h7c.69 0 1.25.56 1.25 1.25v7h1.5V6A2.75 2.75 0 0014 3.25H7v1.5zm-1.5 1.5A2.25 2.25 0 003.25 8.5v6a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25h-6zM4.75 8.5a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-6z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const Copied = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M1.19995 4.73324L5.36662 8.48324L11.2 1.3999"
				stroke="rgba(0,0,0,0.5)"
				strokeWidth="2"
			/>
		</svg>
	);
};
