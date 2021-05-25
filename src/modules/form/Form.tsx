import { FC } from "react";
import { Form as FinalForm } from "react-final-form";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

type FormType = {
	formId?: string;
	initialValues?: Record<string, any>;
	onSubmit(values: any): void;
};

export const Form: FC<FormType & MaybeWithClassName & WithChildren> = ({
	className,
	formId,
	children,
	initialValues,
	onSubmit,
}) => {
	return (
		<FinalForm onSubmit={onSubmit} initialValues={initialValues}>
			{({ handleSubmit }) => (
				<form onSubmit={handleSubmit} className={className} id={formId}>
					{children}
				</form>
			)}
		</FinalForm>
	);
};
