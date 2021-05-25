import { CreateView } from "./Create";

export const Default = () => {
	return (
		<div>
			<CreateView />
		</div>
	);
};

export const Active = () => {
	return (
		<div>
			<CreateView active={true} />
		</div>
	);
};
