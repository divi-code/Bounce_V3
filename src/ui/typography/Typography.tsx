import classNames from "classnames";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import colorStyles from "../styles/Color.module.scss";
import sizeStyles from "../styles/Size.module.scss";
import weightStyles from "../styles/Weight.module.scss";
import { ColorType, FontSizeType, WeightType } from "../types";
import { getColorClassName } from "../utils/get-color-class-name";
import { getSizeClassName } from "../utils/get-size-class-name";
import { getWeightClassName } from "../utils/get-weight-class-name";

import styles from "./Typography.module.scss";

import type { CSSProperties, FC } from "react";

export type TypographyType = {
	Component: Exclude<keyof JSX.IntrinsicElements, "button" | "a">;
	variant: "primary" | "secondary";
	color?: ColorType | "custom";
	size?: FontSizeType;
	weight?: WeightType;
	lighten?: 100 | 90 | 80 | 70 | 60 | 50 | 40 | 30 | 20 | 10;
	style?: CSSProperties;
} & WithChildren &
	MaybeWithClassName;

export const Typography: FC<TypographyType> = ({
	Component,
	className,
	variant,
	weight = "regular",
	color = "primary-black",
	size = 16,
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
			getSizeClassName(size as FontSizeType, sizeStyles),
			//
			getWeightClassName(weight, weightStyles),
			//
			color !== "custom" && getColorClassName(color, colorStyles)
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
		<Typography Component={Component} size={40} weight="semi-bold" variant="secondary" {...props} />
	);
};

export const Heading2: FC<HeadingType> = ({ Component = "h2", ...props }) => {
	return (
		<Typography Component={Component} size={28} weight="semi-bold" variant="secondary" {...props} />
	);
};

export const Heading3: FC<HeadingType> = ({ Component = "h3", ...props }) => {
	return (
		<Typography Component={Component} size={18} weight="semi-bold" variant="secondary" {...props} />
	);
};

type BodyComponentType = Exclude<keyof JSX.IntrinsicElements, "button" | "a">;

type BodyType = Omit<TypographyType, "size" | "Component" | "variant" | "weight"> & {
	Component?: BodyComponentType;
	weight?: Exclude<WeightType, "semi-bold">;
};

export const Body1: FC<BodyType> = ({ Component = "p", weight = "regular", ...props }) => {
	return (
		<Typography Component={Component} size={16} variant="primary" weight={weight} {...props} />
	);
};

export const Caption: FC<BodyType> = ({ Component = "p", weight = "regular", ...props }) => {
	return (
		<Typography Component={Component} size={12} variant="primary" weight={weight} {...props} />
	);
};
