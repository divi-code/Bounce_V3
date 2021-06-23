import classNames from "classnames";
import { default as Link } from "next/dist/client/link";
import React, { CSSProperties, ComponentType, FC, ReactNode } from "react";

import { EmptyObject, MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import styles from "./Button.module.scss";

type ButtonType = "button" | "submit" | "reset";
type HTMLLinkType = "a";

export type ButtonComponentType = {
	disabled?: boolean;
	style?: CSSProperties;
	activeClassName?: string;

	onClick?(e: any): void;
} & {
	iconAfter?: ReactNode;
	iconBefore?: ReactNode;
	icon?: ReactNode;
	variant?: "contained" | "text" | "outlined";
	color?: "primary-white" | "primary-black" | "ocean-blue" | "dark-grey" | "light-grey";
	size?: "large" | "medium";
	weight?: "regular" | "medium" | "bold";
	hover?: boolean;
	active?: boolean;
	rainbowHover?: boolean;
};

type ButtonProps<T extends EmptyObject> = ButtonComponentType &
	(
		| {
				Component: "button" | undefined;
				type: ButtonType;
		  }
		| {
				Component: HTMLLinkType;
				activeClassName?: string;
				href?: string;
				role: "link";
				target?: "_blank";
				rel?: "noopener noreferrer";
		  }
		| ({
				Component: ComponentType<T>;
		  } & T)
	);

export type CommonType = ButtonComponentType & MaybeWithClassName & WithChildren;

export const ButtonComponent: FC<ButtonProps<EmptyObject> & MaybeWithClassName & WithChildren> = ({
	Component = "button",
	className,
	children,
	iconAfter,
	iconBefore,
	icon,
	variant,
	color,
	size,
	weight = "medium",
	hover,
	active,
	disabled,
	rainbowHover,
	onClick,
	...props
}) => (
	<Component
		className={classNames(
			className,
			styles.button,
			icon && styles.icon,
			variant && styles[variant],
			color && variant && styles[`${variant}-${color}`],
			size && styles[size],
			size && variant && styles[`${variant}-${size}`],
			size && icon && styles[`icon-${size}`],
			size && iconBefore && styles[`iconBefore-${size}`],
			size && iconAfter && styles[`iconAfter-${size}`],
			weight && styles[`weight-${weight}`],
			rainbowHover && styles.rainbow,
			hover && styles.hover,
			active && styles.active,
			disabled && styles.disabled
		)}
		onClick={onClick}
		disabled={disabled}
		{...props}
	>
		{iconBefore}
		{icon ? (
			<>
				{icon}
				<span>{children}</span>
			</>
		) : (
			children
		)}
		{iconAfter}
	</Component>
);

export const Button: FC<CommonType & { submit?: boolean }> = ({ submit, ...rest }) => (
	<ButtonComponent Component="button" type={submit ? "submit" : "button"} {...rest} />
);

export const NavLink: FC<CommonType & { href: string; as?: string }> = ({ href, as, ...rest }) => (
	<>
		{href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel") ? (
			<ButtonComponent
				Component="a"
				href={href}
				role="link"
				target="_blank"
				rel="noopener noreferrer"
				{...rest}
			/>
		) : (
			<Link href={href} as={as} passHref>
				<ButtonComponent Component="a" role="link" {...rest} />
			</Link>
		)}
	</>
);

export type PrimaryType = Omit<CommonType, "variant" | "color">;

export const PrimaryButton: FC<PrimaryType & { submit?: boolean }> = ({ ...rest }) => (
	<Button variant="contained" color="primary-black" {...rest} />
);

export const PrimaryLink: FC<PrimaryType & { href: string; as?: string }> = ({ ...rest }) => (
	<NavLink variant="contained" color="primary-black" {...rest} />
);
