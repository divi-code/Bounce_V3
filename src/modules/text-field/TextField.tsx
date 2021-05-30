import React, { FC, ReactNode } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Input } from "@app/ui/input";
import { isRequired } from "@app/utils/validation";

type TextFieldType = {
	name: string;
	type: "text" | "email" | "number";
	placeholder?: string;
	readOnly?: boolean;
	initialValue?: any;
	value?: any;
	step?: string;
	required?: boolean;
	validate?: (value: string) => any;
	before?: string | ReactNode;
	after?: string | ReactNode;
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
	step,
}) => {
	return (
		<Field
			name={name}
			initialValue={initialValue}
			validate={required ? isRequired : validate}
			value={value}
		>
			{({ input, meta }) => (
				<Input
					className={className}
					name={input.name}
					type={input.type}
					value={input.value}
					onChange={input.onChange}
					onBlur={input.onBlur}
					onFocus={input.onFocus}
					placeholder={placeholder}
					readOnly={readOnly}
					required={required}
					before={before}
					after={after}
					inputProps={{ step }}
					error={(meta.error && meta.touched ? meta.error : undefined) || meta.submitError}
				/>
			)}
		</Field>
	);
};
