import { SVGAttributes } from "react";

export const Exit = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 1.067C0 .477.478 0 1.067 0h8.8c.589 0 1.066.478 1.066 1.067V4h-1.6V1.6H1.6v12.8h7.733V12h1.6v2.933c0 .59-.477 1.067-1.066 1.067h-8.8C.477 16 0 15.522 0 14.933V1.067z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15.623 4.167L18.689 8l-3.066 3.833-1.25-1L16 8.8H5.467V7.2H16l-1.627-2.034 1.25-.999z"
				fill="currentColor"
			/>
		</svg>
	);
};
