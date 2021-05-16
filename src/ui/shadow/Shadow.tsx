import classNames from "classnames";
import type { CSSProperties, FC } from "react";

import styles from "./Shadow.module.scss";
import { MaybeWithClassName } from "../../helper/react/types";

type ShadowType = {
	animated: boolean;
	visible: boolean;
	focusLock?: boolean;
};

type ComponentType = ShadowType;

export const Shadow: FC<ComponentType & MaybeWithClassName> = ({
	className,
	visible,
	animated,
	focusLock,
}) => {
	return (
		<div
			className={classNames(
				className,
				styles.component,
				visible && styles.visible,
				animated && styles.animation
			)}
			style={{ "--events": !focusLock ? "none" : "all" } as CSSProperties}
		/>
	);
};
