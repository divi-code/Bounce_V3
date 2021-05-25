import { useContext } from "react";

import { FlowContext, FlowControl } from "./context";

export const useFlowControl = <T extends object = never>() =>
	useContext<FlowControl<T>>(FlowContext);

export const useFlowData = <T>(): T => useContext(FlowContext).data;
