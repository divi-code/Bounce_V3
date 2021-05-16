import type { ModeType } from "../types";

export const getModeClassName = (mode: ModeType, theme: any): string | false => mode && theme[mode];
