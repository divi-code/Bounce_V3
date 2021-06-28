import { FormApi } from "final-form";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

type AnyRecord = Record<string, any>;

export type FormValidator<T extends string> = (
	values: Record<T, any>
) => Partial<Record<T, any>> | Promise<Partial<Record<T, any>>>;

type FormType = {
	formId?: string;
	initialValues?: AnyRecord;
	onSubmit(values: AnyRecord, form: FormApi): void;
	validate?: FormValidator<string>;
};

export const Form: FC<FormType & MaybeWithClassName & WithChildren> = ({
	className,
	formId,
	children,
	initialValues,
	onSubmit,
	validate,
}) => {
	return (
		<FinalForm onSubmit={onSubmit} initialValues={initialValues} validate={validate}>
			{({ handleSubmit }) => (
				<form onSubmit={handleSubmit} className={className} id={formId}>
					{children}
				</form>
			)}
		</FinalForm>
	);
};
