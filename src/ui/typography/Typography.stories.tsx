import { Heading1, Heading2, Heading3, Body1, Caption } from "./Typography";

const style = {
	display: "grid",
	gridTemplateColumns: "auto 1fr",
	gridGap: "2rem",
	alignItems: "center",
};

export const Heading = () => (
	<div style={style}>
		Heading1
		<Heading1 style={{ margin: 0 }}>Find Auction</Heading1>
		Heading2
		<Heading2 style={{ margin: 0 }}>Find Auction</Heading2>
		Heading3
		<Heading3 style={{ margin: 0 }}>Find Auction</Heading3>
	</div>
);

export const Text = () => (
	<div style={style}>
		Body1
		<Body1 style={{ margin: 0 }}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		Caption
		<Caption style={{ margin: 0 }}>Token Information</Caption>
	</div>
);

export const Weight = () => (
	<div style={style}>
		Regular
		<Body1 style={{ margin: 0 }} weight="regular">
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		Medium
		<Body1 style={{ margin: 0 }} weight="medium">
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		Bold
		<Body1 style={{ margin: 0 }} weight="bold">
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
	</div>
);

export const Color = () => (
	<div style={style}>
		Primary black
		<div style={{ padding: "0.5rem" }}>
			<Body1 style={{ margin: 0 }} color="primary-black">
				Fill in the fields optional below to easily find the auction that suits you
			</Body1>
		</div>
		Primary white
		<div style={{ padding: "0.5rem", backgroundColor: "rgba(0, 0, 0, 1)" }}>
			<Body1 style={{ margin: 0 }} color="primary-white">
				Fill in the fields optional below to easily find the auction that suits you
			</Body1>
		</div>
	</div>
);

export const lighten = () => (
	<div
		style={{
			...style,
		}}
	>
		100%
		<Body1 style={{ margin: 0 }} lighten={100}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		90%
		<Body1 style={{ margin: 0 }} lighten={90}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		80%
		<Body1 style={{ margin: 0 }} lighten={80}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		70%
		<Body1 style={{ margin: 0 }} lighten={70}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		60%
		<Body1 style={{ margin: 0 }} lighten={60}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		50%
		<Body1 style={{ margin: 0 }} lighten={50}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		40%
		<Body1 style={{ margin: 0 }} lighten={40}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
	</div>
);

export const blackLighten = () => (
	<div
		style={{
			...style,
			backgroundColor: "rgba(0, 0, 0, 1)",
			padding: "0.5rem",
			color: "rgba(255, 255, 255, 1)",
		}}
	>
		100%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={100}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		90%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={90}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		80%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={80}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		70%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={70}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		60%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={60}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		50%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={50}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
		40%
		<Body1 style={{ margin: 0 }} color="primary-white" lighten={40}>
			Fill in the fields optional below to easily find the auction that suits you
		</Body1>
	</div>
);
