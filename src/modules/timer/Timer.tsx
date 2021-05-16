import React, { FC, useEffect, useState } from "react";

import { getDeltaTime, toDeltaTimer } from "../../utils/page/time";

export const Timer: FC<{ timer: number; onZero: () => void }> = ({ timer, onZero }) => {
	const [time, setTime] = useState(getDeltaTime(timer));

	useEffect(() => {
		const tm = setInterval(() => setTime(getDeltaTime(timer)), 1000);
		return () => clearInterval(tm);
	}, [timer]);

	useEffect(() => {
		if (!time) {
			onZero();
		}
	}, [time]);

	return <>{toDeltaTimer(time)}</>;
};
