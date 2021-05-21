import classNames from "classnames";

import { NextRouter, withRouter } from "next/router";

import { HEADER_LINKS } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { NavLink, Button } from "@app/ui/button";

import styles from "./Navigation.module.scss";

import type { FC } from "react";

export type LinkType = {
	link: string;
	links: Record<string, string>;
};

type NavigationType = {
	links?: Record<string, string | LinkType>;
};

type ComponentType = NavigationType & MaybeWithClassName & { router?: NextRouter };

const settings = {
	variant: "text" as const,
	size: "large" as const,
	color: "light-grey" as const,
};

export const NavigationBase: FC<ComponentType> = ({ className, links = HEADER_LINKS, router }) => {
	return (
		<div className={className}>
			<ul className={styles.list}>
				{Object.keys(links).map((key) => {
					const item = links[key];
					const hasDropdown = typeof item !== "string";
					const href = typeof item !== "string" ? undefined : item;
					const subLinks = typeof item !== "string" ? item : undefined;

					const active = item.children
						? Object.values(item.children).some((item) => router.pathname === item)
						: router.pathname === item;

					return (
						<li key={key} className={styles.item}>
							{href !== undefined ? (
								<NavLink
									className={classNames(styles.link, active && styles.active)}
									href={href}
									{...settings}
								>
									{key}
								</NavLink>
							) : (
								<Button className={styles.link} {...settings}>
									{key}
								</Button>
							)}
							{hasDropdown && subLinks && (
								<div className={styles.dropdown}>
									<ul className={styles.subList}>
										{Object.keys(subLinks).map((subKey) => {
											const subItem = subLinks[subKey];

											return (
												<li key={subKey} className={styles.subItem}>
													<NavLink className={styles.subLink} href={subItem}>
														{subKey}
													</NavLink>
												</li>
											);
										})}
									</ul>
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export const Navigation = withRouter(
	({ router, ...props }: MaybeWithClassName & NavigationType & { router: NextRouter }) => {
		return <NavigationBase router={router} {...props} />;
	}
);
