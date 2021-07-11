import classNames from "classnames";

import { FC } from "react";

import { CERTIFIED_PATH, FANGIBLE_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { NavLink } from "@app/ui/button";
import { ColoredDots, Dots } from "@app/ui/icons/dots";

import { Plus } from "@app/ui/icons/plus";

import { ShortLogo } from "@app/ui/icons/short-logo";

import styles from "./DotLinks.module.scss";

export const DotLinks: FC<MaybeWithClassName> = ({ className }) => {
	return (
		<div className={classNames(className, styles.component)}>
			<button className={styles.toggle}>
				<ColoredDots className={styles.colored} />
				<Dots />
			</button>
			<div className={styles.dropdown}>
				<ul className={styles.list}>
					<li className={styles.item}>
						<NavLink
							className={styles.link}
							href={FANGIBLE_PATH}
							iconBefore={<Plus style={{ width: 15, marginRight: 12 }} />}
						>
							Fangible
						</NavLink>
					</li>
					<li className={styles.item}>
						<NavLink
							className={styles.link}
							href={CERTIFIED_PATH}
							iconBefore={<ShortLogo style={{ width: 14, marginRight: 12 }} />}
						>
							Bounce Certified
						</NavLink>
					</li>
				</ul>
			</div>
		</div>
	);
};
