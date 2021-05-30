import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./FoldableSection.module.scss";
import { usePrevious } from "./hooks/use-previous";

import type { CSSProperties, FC, ReactNode } from "react";

type FoldableType = {
	children: ReactNode;
	className?: string;
	open: boolean;
	keepMaximum?: boolean;
	useHeight?: boolean;
	timeout: number;
	ssr?: boolean;
	duration?: number;
};

const measure = (ref: HTMLDivElement) => {
	ref.classList.add(styles.noAnimation);
	ref.classList.add(styles.measureMaxHeight);

	const height = ref.offsetHeight || 0;
	ref.classList.remove(styles.measureMaxHeight);
	// toggle update
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	ref.offsetHeight;
	ref.classList.remove(styles.noAnimation);

	return height;
};

const NOP = () => null;

type ComponentType = FoldableType & MaybeWithClassName;

export const FoldableSection: FC<ComponentType> = ({
	className,
	keepMaximum,
	useHeight,
	timeout = 300,
	open: openProp,
	ssr,
	children,
	duration,
}) => {
	const [open, setIsOpen] = useState(ssr ? openProp : false);
	const [idle, setIdle] = useState(ssr);
	const [maxHeight, setMaxHeight] = useState(0);
	const blockRef = useRef<HTMLDivElement>(null);
	const [inited, setInited] = useState(ssr);

	useLayoutEffect(() => {
		setInited(true);
	}, []);

	const oldOpen = usePrevious(openProp);

	// this effect has no deps and checks runs conditions inside to allow change
	// to be applied to the underlay DOM structures
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const { current: ref } = blockRef;

		// detect that changes has to be applied
		const isChanging = openProp !== oldOpen || openProp !== open || (openProp && !inited);

		if (!isChanging || !ref) {
			return NOP;
		}

		if (idle) {
			// if changes has to be applied, but component is in "Idle" mode
			// - first disable Idle mode, to prepare component to further transitions
			// and only then proceed
			setIdle(false);
		} else {
			if (openProp) {
				// in case of "going to open" - measure target height
				const measuredHeight = measure(ref);

				setMaxHeight((oldHeight) =>
					keepMaximum ? Math.max(measuredHeight, oldHeight || 0) : measuredHeight
				);
			}

			setIsOpen(openProp);

			if (openProp) {
				// set idle state at the end of a animation
				const tm = setTimeout(() => {
					setIdle(true);
				}, timeout);

				return () => clearTimeout(tm);
			}
		}

		return NOP;
	});

	return (
		<div
			className={classNames(className, styles.base, (!open || !idle) && styles.foldableSection)}
			style={
				inited
					? ({
							[useHeight ? "height" : "maxHeight"]: open ? (idle ? undefined : maxHeight) : 0,
							"--duration": duration ? `${duration}ms` : "300ms",
					  } as CSSProperties)
					: undefined
			}
			ref={blockRef}
		>
			{(open || !idle || (!inited && !ssr)) && children}
		</div>
	);
};
