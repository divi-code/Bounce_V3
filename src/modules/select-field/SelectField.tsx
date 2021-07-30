import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Select } from "@app/ui/select";
import { isRequired } from "@app/utils/validation";

type SelectFieldType = {
	className?: string;
	options: any[];
	value?: string;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
};

export const SelectField: FC<SelectFieldType & MaybeWithClassName> = ({
	className,
	options,
	name,
	placeholder,
	readOnly,
	value,
	required,
}) => {
	return (
		<Field name={name} value={value} validate={required ? isRequired : undefined}>
			{({ input }) => (
				<Select
					className={className}
					options={options}
					name={input.name}
					value={input.value}
					onChange={input.onChange}
					// placeholder={placeholder}
					readOnly={readOnly}
					required={required}
				/>
			)}
		</Field>
	);
};
