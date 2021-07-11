import classNames from "classnames";
import React, { forwardRef } from "react";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import { Caption } from "@app/ui/typography";

import styles from "./FieldFrame.module.scss";

type FieldType = {
	small?: boolean;
	focus?: boolean;
	placeholder?: boolean;
	ariaOwns?: string;
	ariaHaspopup?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog";
	ariaExpanded?: boolean | "false" | "true";
	error?: string;

	onKeyDown?(e: any): void;
	onClick?(): void;
} & WithChildren &
	MaybeWithClassName;

export const FieldFrame = forwardRef<HTMLButtonElement, FieldType>(
	(
		{
			className,
			small,
			error,
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
			<>
				<button
					className={classNames(
						className,
						styles.component,
						small && styles.small,
						error && styles.errorState,
						focus && styles.focus,
						placeholder && styles.placeholder
					)}
					type="button"
					onClick={onClick}
					onKeyDown={onKeyDown}
					ref={ref}
					aria-owns={ariaOwns}
					aria-haspopup={ariaHaspopup}
					aria-expanded={ariaExpanded}
				>
					{children}
				</button>
				<div className={styles.error}>{error && <Caption Component="span">{error}</Caption>}</div>
			</>
		);
	}
);
