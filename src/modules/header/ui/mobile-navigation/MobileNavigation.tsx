import classNames from "classnames";

import React from "react";

import { MOBILE_HEADER_LINKS } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { useWindowSize } from "@app/hooks/use-window-size";
import { NavLink } from "@app/ui/button";

import styles from "./MobileNavigation.module.scss";

import type { CSSProperties, FC, ReactNode } from "react";

export type LinkType = {
	link: string;
	links: Record<string, string>;
};

type MobileNavigationType = {
	sideEffect?: ReactNode;
	links?: Record<string, string>;
	onClick?(): void;
};

type ComponentType = MobileNavigationType & MaybeWithClassName;

const settings = {
	variant: "text" as const,
	size: "large" as const,
	color: "primary-black" as const,
};

export const MobileNavigation: FC<ComponentType> = ({
	className,
	links = MOBILE_HEADER_LINKS,
	sideEffect,
	onClick,
}) => {
	const windowHeight = useWindowSize()[1];

	return (
		<div
			className={classNames(className, styles.component)}
			style={{ "--window-height": `${windowHeight}px` } as CSSProperties}
		>
			<ul className={styles.list}>
				{Object.keys(links).map((key) => {
					return (
						<li key={key} className={styles.item}>
							<NavLink href={links[key]} onClick={onClick} {...settings}>
								{key}
							</NavLink>
						</li>
					);
				})}
			</ul>
			{sideEffect}
		</div>
	);
};
