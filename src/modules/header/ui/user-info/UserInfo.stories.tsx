import { UserInfoView } from "./UserInfo";

export const Default = () => {
	return (
		<div style={{ display: "grid", justifyContent: "flex-start" }}>
			<UserInfoView
				address="0xF2e62668f6Fd9Bb71fc4E80c44CeF32940E27a45"
				ethBalance="1.45"
				name="John"
				onLogout={() => alert("disconnect")}
			/>
		</div>
	);
};
