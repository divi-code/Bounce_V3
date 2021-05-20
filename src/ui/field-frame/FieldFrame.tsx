import classNames from "classnames";
import { forwardRef } from "react";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import styles from "./FieldFrame.module.scss";

type FieldType = {
	focus?: boolean;
	placeholder?: boolean;
	ariaOwns?: string;
	ariaHaspopup?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog";
	ariaExpanded?: boolean | "false" | "true";

	onKeyDown?(e: any): void;
	onClick?(): void;
} & WithChildren &
	MaybeWithClassName;

export const FieldFrame = forwardRef<HTMLButtonElement, FieldType>(
	(
		{
			className,
			focus,
			placeholder,
			ariaOwns,
			ariaHaspopup,
			ariaExpanded,
			children,
			onClick,
			onKeyDown,
		},
		ref
	) => {
		return (
			<button
				className={classNames(
					className,
					styles.component,
					focus && styles.focus,
					placeholder && styles.placeholder
				)}
				onClick={onClick}
				onKeyDown={onKeyDown}
				ref={ref}
				aria-owns={ariaOwns}
				aria-haspopup={ariaHaspopup}
				aria-expanded={ariaExpanded}
			>
				{children}
			</button>
		);
	}
);
