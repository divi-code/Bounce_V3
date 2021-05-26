import { concat, hexlify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import { nameprep, toUtf8Bytes } from "@ethersproject/strings";

const Zeros = new Uint8Array(32);
Zeros.fill(0);

const Partition = new RegExp("^((.*)\\.)?([^.]+)$");

export function isValidName(name) {
	try {
		const comps = name.split(".");

		for (let i = 0; i < comps.length; i++) {
			if (nameprep(comps[i]).length === 0) {
				throw new Error("empty");
			}
		}

		return true;
	} catch (error) {
		//nope
	}

	return false;
}

export function namehash(name) {
	let result: Uint8Array | string = Zeros;

	while (name.length) {
		const partition = name.match(Partition);
		const label = toUtf8Bytes(nameprep(partition[3]));
		result = keccak256(concat([result, keccak256(label)]));
		name = partition[2] || "";
	}

	return hexlify(result);
}
//# sourceMappingURL=namehash.js.map
