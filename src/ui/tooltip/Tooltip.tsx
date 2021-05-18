import classNames from "classnames";

import { SVGAttributes } from "react";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import styles from "./Tooltip.module.scss";

import type { CSSProperties, FC } from "react";

export type LabelType = {
	size?: "small" | "medium";
	style?: CSSProperties;
} & WithChildren &
	MaybeWithClassName;

const Icon = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				opacity={0.5}
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.77 8A6.77 6.77 0 111.23 8a6.77 6.77 0 0113.54 0zM16 8A8 8 0 110 8a8 8 0 0116 0zm-7.288 2.923H7.228v1.385h1.484v-1.385zM5.644 5.805a3.288 3.288 0 00-.177 1.108h1.262c0-.502.108-.9.322-1.196.221-.303.56-.454 1.019-.454.096 0 .207.022.332.066.126.044.244.115.355.21.11.097.203.226.276.388.082.155.122.344.122.565 0 .185-.026.344-.077.477-.045.132-.111.254-.2.365a1.77 1.77 0 01-.288.288l-.332.288a3.202 3.202 0 00-.388.388 1.856 1.856 0 00-.265.443c-.074.17-.13.37-.167.598-.03.222-.044.495-.044.82H8.59c0-.266.023-.491.067-.676a1.66 1.66 0 01.21-.476c.089-.14.192-.266.31-.377.119-.11.248-.225.388-.343l.355-.31c.118-.111.221-.233.31-.366.096-.14.17-.303.221-.487.06-.192.089-.418.089-.676a2.31 2.31 0 00-.188-.953c-.126-.28-.3-.513-.521-.698a2.102 2.102 0 00-.764-.432 2.768 2.768 0 00-.942-.155c-.406 0-.775.067-1.108.2a2.396 2.396 0 00-.841.543c-.23.236-.407.52-.532.852z"
				fill="#000"
			/>
		</svg>
	);
};

export const Tooltip: FC<LabelType> = ({ className, size = "small", children, ...props }) => (
	<span className={classNames(className, styles.component, size && styles[size])} {...props}>
		<Icon />
		<span className={styles.wrapper}>
			<span className={styles.message}>{children}</span>
		</span>
	</span>
);
