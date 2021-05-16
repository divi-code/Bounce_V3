import classNames from "classnames";
import type { CSSProperties, FC } from "react";
import { MaybeWithClassName, WithChildren } from "../../helper/react/types";

import styles from "./Typography.module.scss";
import colorStyles from "../styles/Color.module.scss";
import sizeStyles from "../styles/Size.module.scss";
import weightStyles from "../styles/Weight.module.scss";
import { ColorType, FontSizeType, WeightType } from "../types";
import { getColorClassName } from "../utils/get-color-class-name";
import { getSizeClassName } from "../utils/get-size-class-name";
import { getWeightClassName } from "../utils/get-weight-class-name";

export type TypographyType = {
	Component: Exclude<keyof JSX.IntrinsicElements, "button" | "a">;
	variant: "primary" | "secondary";
	color?: ColorType;
	size?: FontSizeType;
	weight?: WeightType;
	lighten?: 100 | 90 | 80 | 70 | 60 | 50 | 40;
	style?: CSSProperties;
} & WithChildren &
	MaybeWithClassName;

export const Typography: FC<TypographyType> = ({
	Component,
	className,
	variant,
	weight = "regular",
	color = "white",
	size = 18,
	lighten = 100,
	style,
	children,
	...props
}) => (
	<Component
		className={classNames(
			className,
			styles.component,
			//
			styles[variant],
			//
			getSizeClassName(size, sizeStyles),
			//
			getWeightClassName(weight, weightStyles),
			//
			getColorClassName(color, colorStyles)
			//
		)}
		style={{ ...style, "--lighten": lighten / 100 } as CSSProperties}
		{...props}
	>
		{children}
	</Component>
);

export type HeadingComponentType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingType = Omit<TypographyType, "size" | "Component" | "weight" | "variant"> & {
	Component?: HeadingComponentType;
};

export const Heading1: FC<HeadingType> = ({ Component = "h1", ...props }) => {
	return (
		<Typography Component={Component} size={58} weight="bold" variant="secondary" {...props} />
	);
};

export const Heading2: FC<HeadingType> = ({ Component = "h2", ...props }) => {
	return (
		<Typography Component={Component} size={50} weight="bold" variant="secondary" {...props} />
	);
};

export const Heading3: FC<HeadingType> = ({ Component = "h3", ...props }) => {
	return (
		<Typography Component={Component} size={28} weight="bold" variant="secondary" {...props} />
	);
};

export const Heading4: FC<HeadingType & { weight?: WeightType }> = ({
	Component = "h4",
	weight = "bold",
	...props
}) => {
	return (
		<Typography Component={Component} size={22} weight={weight} variant="secondary" {...props} />
	);
};

type BodyComponentType = Exclude<keyof JSX.IntrinsicElements, "button" | "a">;

type BodyType = Omit<TypographyType, "size" | "Component" | "variant"> & {
	Component?: BodyComponentType;
};

export const Body1: FC<BodyType> = ({ Component = "p", ...props }) => {
	return <Typography Component={Component} size={18} variant="primary" {...props} />;
};

export const Body2: FC<BodyType> = ({ Component = "p", ...props }) => {
	return <Typography Component={Component} size={16} variant="primary" {...props} />;
};

export const Body3: FC<BodyType> = ({ Component = "p", ...props }) => {
	return <Typography Component={Component} size={14} variant="primary" {...props} />;
};
