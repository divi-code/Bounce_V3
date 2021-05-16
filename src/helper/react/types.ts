import type { ReactElement, ReactNode } from "react";

export interface EmptyObject {}

export type WithClassName = {
	className: string;
};

export type MaybeWithClassName = {
	className?: string;
};

export type WithChildren = {
	children: ReactNode;
};

/**
 * ReactComponent
 * a subset of React.FC with no children and extra methods
 */
export type RC<T = EmptyObject> = (props: T) => ReactElement | null;

/**
 * ClassNamedComponent
 */
export type CNC<T = EmptyObject> = RC<T & MaybeWithClassName>;
