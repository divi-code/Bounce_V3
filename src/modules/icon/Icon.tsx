import React, { useEffect, useState } from "react";

import EmptySVG from "./assets/empty.svg";

export interface IIconProps {
	src: React.ReactNode;
	cacheKey?: string;
}

const CacheKeys = {};

export const Icon: React.FC<IIconProps> = ({ src, cacheKey }) => {
	const [error, setError] = useState<boolean>(false);

	if (!CacheKeys[cacheKey]) {
		CacheKeys[cacheKey] = src;
	}

	useEffect(() => {
		setError(false);
	}, [src]);

	if (!src || error) {
		return <img src={EmptySVG} alt="" />;
	}

	return <img src={(CacheKeys[cacheKey] || src) as string} onError={() => setError(true)} alt="" />;
};
