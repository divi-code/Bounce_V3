const locks: Record<string, boolean> = {};

export const withAsyncCache = async (key: string, callback: () => Promise<void>) => {
	if (locks[key]) {
		return;
	}

	locks[key] = true;

	try {
		await callback();
	} catch (e) {
		console.error("error processing", key);
	} finally {
		delete locks[key];
	}
};
