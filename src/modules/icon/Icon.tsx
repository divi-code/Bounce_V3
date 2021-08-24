import React, { useEffect, useState } from "react";

import EmptySVG from "./assets/empty.svg";

export interface IIconProps {
	src: React.ReactNode;
	cacheKey?: string;
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
