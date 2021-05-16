export const getEnv = (): "test" | "prod" => {
	const { hostname } = window.location;
	if (hostname.includes("vercel") || hostname === "localhost") {
		return "test";
	}
	return "prod";
};

export const getAPIBase = () => {
	if (getEnv() === "test") {
		return "https://test.api.polkadomain.org";
	}
	return "https://api.polkadomain.org";
};
