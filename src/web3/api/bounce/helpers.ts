import { getOtcPools } from "@app/web3/api/bounce/otc";
import { getPools } from "@app/web3/api/bounce/pool";

export const callPoolDataByID = async (bounceContract: any, poolID: number) => {
	if (!bounceContract) throw new Error("Function Error: callPoolDataByID, params error");

	try {
		return await getPools(bounceContract, poolID);
	} catch (error) {
		console.error(error);
	}
};

export const callOTCPoolDataByID = async (bounceContract: any, poolID: number) => {
	if (!bounceContract) throw new Error("Function Error: callPoolDataByID, params error");

	try {
		return await getOtcPools(bounceContract, poolID);
	} catch (error) {
		console.error(error);
	}
};
