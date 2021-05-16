import ReactDOM from "react-dom";

type Callback = () => void;

let bulkOperations: Callback[] = [];

const executeInBulk = () => {
	const ops = bulkOperations;
	bulkOperations = [];
	ReactDOM.unstable_batchedUpdates(() => ops.forEach((op) => op()));
};

export const callBatched = (callback: Callback) => {
	if (!bulkOperations.length) {
		setTimeout(executeInBulk, 1);
	}
	bulkOperations.push(callback);
};
