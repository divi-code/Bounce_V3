import { getPools } from "@app/web3/api/bounce/contract";

export const callPoolDataByID = async (bounceContract: any, poolID: number) => {
	if (!bounceContract) throw new Error("Function Error: callPoolDataByID, params error");

	try {
		return await getPools(bounceContract, poolID);
	} catch (error) {
		console.error(error);
	}
};
