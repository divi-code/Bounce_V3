import { PopUpContainer as PopUpContainerComponent } from "./PopUpContainer";

export const Default = () => (
	<PopUpContainerComponent visible animated onClose={() => alert("Close")}>
		<div style={{ minHeight: "30vh" }}>Modal content</div>
	</PopUpContainerComponent>
);

export const MaxWidth = () => (
	<PopUpContainerComponent visible animated onClose={() => alert("Close")} maxWidth={640}>
		<div style={{ minHeight: "30vh" }}>Modal content</div>
	</PopUpContainerComponent>
);
