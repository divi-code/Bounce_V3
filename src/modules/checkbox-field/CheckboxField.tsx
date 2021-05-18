import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Checkbox } from "@app/ui/checkbox";

type CheckboxFieldType = {
	label: string;
	name: string;
	readOnly?: boolean;
	initialValue?: any;
	value?: any;
	required?: boolean;
};

export const CheckboxField: FC<CheckboxFieldType & MaybeWithClassName> = ({
	className,
	label,
	name,
	readOnly,
	initialValue,
	required,
	value,
}) => {
	return (
		<Field name={name} initialValue={initialValue} value={value} type="checkbox">
			{({ input }) => (
				<Checkbox
					data-test={input}
					className={className}
					name={input.name}
					value={input.value}
					onChange={input.onChange}
					readOnly={readOnly}
					required={required}
					checked={input.checked}
				>
					{label}
				</Checkbox>
			)}
		</Field>
	);
};
