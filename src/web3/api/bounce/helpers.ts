export const callPoolDataByID = async (bounceContract: any, methodName: string, poolID: number) => {
	if (!bounceContract || !methodName)
		throw new Error("Function Error: callPoolDataByID, params error");

	try {
		const res = await bounceContract.methods[methodName](poolID).call();

		return res;
	} catch (error) {
		console.error(error);
		// throw new Error('request Error: callQueryData', error)
	}
};

export const queryPoolItem = async <T extends string>(
	bounceContract,
	poolID: number,
	keyMap: Array<{ key: string; name: T }>
): Promise<Record<T, any>> => {
	const poolItemDate: any = {};

	await Promise.all(
		keyMap.map(async (item) => {
			poolItemDate[item.name] = await callPoolDataByID(bounceContract, item.key, poolID);
		})
	);

	return poolItemDate;
};
