import { SVGAttributes } from "react";

export type IArrowPosition = "top" | "bottom" | "left" | "right";
export interface IArrowProps extends SVGAttributes<SVGElement> {
	position?: IArrowPosition;
}

const styles = {
	transition: "transform 0.2s ease-out",
};

export const Arrow: React.FC<IArrowProps> = ({ position = "bottom", ...rest }) => {
	const positions = {
		top: "0deg",
		bottom: "180deg",
		left: "270deg",
		right: "90deg",
	};

	return (
		<svg
			style={{ ...styles, transform: `rotate(${positions[position]})` }}
			width={18}
			height={11}
			viewBox="0 0 18 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...rest}
		>
			<path d="M17 10L9 2l-8 8" stroke="#000" strokeWidth={2} />
		</svg>
	);
};
