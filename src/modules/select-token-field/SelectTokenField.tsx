import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { SelectToken } from "@app/ui/select-token";

type SelectTokenFieldType = {
	className?: string;
	value?: string;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
};

export const SelectTokenField: FC<SelectTokenFieldType & MaybeWithClassName> = ({
	className,
	name,
	placeholder,
	readOnly,
	value,
	required,
}) => {
	return (
		<Field name={name} value={value}>
			{({ input }) => (
				<SelectToken
					className={className}
					name={input.name}
					value={input.value}
					onChange={input.onChange}
					placeholder={placeholder}
					readOnly={readOnly}
					required={required}
				/>
			)}
		</Field>
	);
};
