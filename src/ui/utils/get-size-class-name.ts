import type { FontSizeType } from "../types";

export const getSizeClassName = (size: FontSizeType, theme: any): string | false =>
	size && theme[`font-${size}`];
