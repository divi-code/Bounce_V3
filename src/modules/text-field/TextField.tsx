import React, { FC, ReactNode } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Input } from "../../ui/input";

type TextFieldType = {
	name: string;
	type: "text" | "email";
	placeholder?: string;
	readOnly?: boolean;
	initialValue?: any;
	required?: boolean;
	validate?: (value: string) => any;
	before?: string | ReactNode;
	after?: string | ReactNode;
	value?: any;
};

export const TextField: FC<TextFieldType & MaybeWithClassName> = ({
	className,
	name,
	placeholder,
	readOnly,
	initialValue,
	required,
	validate,
	before,
	after,
	value,
}) => {
	return (
		<Field name={name} initialValue={initialValue} validate={validate} value={value}>
			{({ input, meta }) => (
				<Input
					className={className}
					name={input.name}
					type={input.type}
					onBlur={input.onBlur}
					onFocus={input.onFocus}
					placeholder={placeholder}
					readOnly={readOnly}
					required={required}
					before={before}
					after={after}
					error={meta.error || meta.submitError}
				/>
			)}
		</Field>
	);
};
