import React, { useEffect, useState } from "react";

// import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import EmptySVG from "./assets/empty.svg";

export interface IIconProps {
	src: React.ReactNode;
}

export const Icon: React.FC<IIconProps> = ({ src }) => {
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		setError(false);
	}, [src]);

	if (!src || error) {
		return <img src={EmptySVG} alt="" />;
	}

	return <img src={src as string} onError={() => setError(true)} alt="" />;
};
