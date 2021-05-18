import { Button } from "./Button";

const style = {
	display: "grid",
	gridTemplateColumns: "auto auto",
	gridGap: "2rem",
	alignItems: "center",
	justifyContent: "flex-start",
};

export const Variant = () => (
	<div style={style}>
		Contained
		<Button size="large" variant="contained" color="primary-black">
			Create
		</Button>
		Outlined
		<Button size="large" variant="outlined" color="primary-black">
			Create
		</Button>
		Text
		<Button size="large" variant="text" color="primary-black">
			Create
		</Button>
	</div>
);

export const Size = () => (
	<div style={{ ...style, gridTemplateColumns: "auto auto auto auto" }}>
		<span></span>
		<span>Contained</span>
		<span>Outlined</span>
		<span>Text</span>
		Medium
		<Button size="medium" variant="contained" color="primary-black">
			Create
		</Button>
		<Button size="medium" variant="outlined" color="primary-white">
			Create
		</Button>
		<Button size="medium" variant="text" color="dark-grey">
			Create
		</Button>
		Large
		<Button size="large" variant="contained" color="primary-black">
			Create
		</Button>
		<Button size="large" variant="outlined" color="primary-white">
			Create
		</Button>
		<Button size="large" variant="text" color="dark-grey">
			Create
		</Button>
	</div>
);

export const Color = () => (
	<div style={{ ...style, gridTemplateColumns: "auto auto auto auto" }}>
		<span></span>
		<span>Contained</span>
		<span>Outlined</span>
		<span>Text</span>
		Primary white
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<Button size="large" variant="outlined" color="primary-white">
			Create
		</Button>
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		Primary black
		<Button size="large" variant="contained" color="primary-black">
			Create
		</Button>
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<Button size="large" variant="text" color="primary-black">
			Create
		</Button>
		Ocean blue
		<Button size="large" variant="contained" color="ocean-blue">
			Create
		</Button>
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		Dark grey
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<Button size="large" variant="text" color="dark-grey">
			Create
		</Button>
		Light grey
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<span style={{ color: "rgba(224, 75, 65, 1)" }}>Does not exist</span>
		<Button size="large" variant="text" color="light-grey">
			Create
		</Button>
	</div>
);

export const ContainedPrimaryBlack = () => (
	<div style={style}>
		Default
		<Button size="large" variant="contained" color="primary-black">
			Create
		</Button>
		Hover
		<Button size="large" variant="contained" color="primary-black" hover>
			Create
		</Button>
		Active
		<Button size="large" variant="contained" color="primary-black" active>
			Create
		</Button>
	</div>
);

export const ContainedOceanBlue = () => (
	<div style={style}>
		Default
		<Button size="large" variant="contained" color="ocean-blue">
			Create
		</Button>
		Hover
		<Button size="large" variant="contained" color="ocean-blue" hover>
			Create
		</Button>
		Active
		<Button size="large" variant="contained" color="ocean-blue" active>
			Create
		</Button>
	</div>
);

export const OutlinedPrimaryWhite = () => (
	<div style={style}>
		Default
		<Button size="large" variant="outlined" color="primary-white">
			Create
		</Button>
		Hover
		<Button size="large" variant="outlined" color="primary-white" hover>
			Create
		</Button>
		Active
		<Button size="large" variant="outlined" color="primary-white" active>
			Create
		</Button>
	</div>
);

export const TextPrimaryBlack = () => (
	<div style={style}>
		Default
		<Button size="large" variant="text" color="primary-black">
			Create
		</Button>
		Hover
		<Button size="large" variant="text" color="primary-black" hover>
			Create
		</Button>
		Active
		<Button size="large" variant="text" color="primary-black" active>
			Create
		</Button>
	</div>
);

export const TextDarkGrey = () => (
	<div style={style}>
		Default
		<Button size="large" variant="text" color="dark-grey">
			Create
		</Button>
		Hover
		<Button size="large" variant="text" color="dark-grey" hover>
			Create
		</Button>
		Active
		<Button size="large" variant="text" color="dark-grey" active>
			Create
		</Button>
	</div>
);

export const TextLightGrey = () => (
	<div style={style}>
		Default
		<Button size="large" variant="text" color="light-grey">
			Create
		</Button>
		Hover
		<Button size="large" variant="text" color="light-grey" hover>
			Create
		</Button>
		Active
		<Button size="large" variant="text" color="light-grey" active>
			Create
		</Button>
	</div>
);
