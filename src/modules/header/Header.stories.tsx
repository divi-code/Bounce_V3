import { HeaderView } from "./Header";

export const Default = () => {
	return (
		<div>
			<HeaderView active={false} />
		</div>
	);
};

export const Active = () => {
	return (
		<div>
			<HeaderView active={true} />
		</div>
	);
};
