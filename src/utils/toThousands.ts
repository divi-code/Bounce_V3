export const toThousands = (num: number): string => {
	let result = "";
	const numArr = num.toString().split(".");
	let int = numArr[0];
	const decmial = numArr[1] ? "." + numArr[1] : "";

	while (int.length > 3) {
		result = "," + int.slice(-3) + result;
		int = int.slice(0, int.length - 3);
	}

	if (int) {
		result = int + result;
	}

	return result + decmial;
};
