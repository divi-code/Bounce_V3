import dynamic from "next/dynamic";
import { FC, Fragment } from "react";
import { WithChildren } from "../../helper/react/types";

const NoSsr: FC<WithChildren> = ({ children }) => <Fragment>{children}</Fragment>;

export default dynamic(() => Promise.resolve(NoSsr), {
	ssr: false,
});
