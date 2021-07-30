import React, { useEffect, useState } from "react";

// import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import EMPTY from "./assets/empty.svg";

export interface IIconProps {
	src: string;
}

export const Icon: React.FC<IIconProps> = ({ src }) => {
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		setError(false);
	}, [src]);

	if (!src) {
		return null;
	}

	return <img src={error ? EMPTY : src} onError={() => setError(true)} alt="" />;
};
