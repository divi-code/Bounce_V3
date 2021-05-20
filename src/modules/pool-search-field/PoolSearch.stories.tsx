import { Form } from "react-final-form";

import { PoolSearchField } from "@app/modules/pool-search-field/PoolSearchField";
import { PopupTeleporterTarget } from "@app/ui/pop-up-container";

export const Default = () => (
	<>
		<Form onSubmit={(values) => console.log("sumbut", values)}>
			{({ handleSubmit }) => (
				<form onSubmit={handleSubmit}>
					<PoolSearchField placeholder="From" name="pool" />
				</form>
			)}
		</Form>
		<PopupTeleporterTarget />
	</>
);

export const InitialValue = () => (
	<>
		<Form
			onSubmit={(values) => console.log("sumbut", values)}
			initialValues={{
				pool: { id: "test" },
			}}
		>
			{({ handleSubmit }) => (
				<form onSubmit={handleSubmit}>
					<PoolSearchField placeholder="From" name="pool" />
				</form>
			)}
		</Form>
		<PopupTeleporterTarget />
	</>
);
