export function getAuctionAddress(chainId) {
	switch (chainId) {
		case 1:
			return "0xa9b1eb5908cfc3cdf91f9b8b3a74108598009096";
		case 4:
			return "0x5e26fa0fe067d28aae8aff2fb85ac2e693bd9efa";
		case 97:
			return "";
		case 56:
			return "0x1188d953aFC697C031851169EEf640F23ac8529C";
		default:
			return "0xa9b1eb5908cfc3cdf91f9b8b3a74108598009096";
	}
}

export function getStakingAddress(chainId) {
	switch (chainId) {
		case 1:
			return "0x98945BC69A554F8b129b09aC8AfDc2cc2431c48E";
		case 4:
			return "0xa77A9FcbA2Ae5599e0054369d1655D186020ECE1";
		// case 4:
		// return "0x4911C30A885EfcdD51B351B1810b1FEA73796338";
		default:
			return "0x98945BC69A554F8b129b09aC8AfDc2cc2431c48E";
	}
}
