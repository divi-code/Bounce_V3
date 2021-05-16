import type { WeightType } from "../types";

export const getWeightClassName = (weight: WeightType, theme: any): string | false =>
	weight && theme[weight];
