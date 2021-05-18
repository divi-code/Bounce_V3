import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { Radio } from "@app/ui/radio";

type RadioFieldType = {
	label: string;
	name: string;
	readOnly?: boolean;
	initialValue?: any;
	value?: any;
	tooltip?: string;
	required?: boolean;
};

export const RadioField: FC<RadioFieldType & MaybeWithClassName> = ({
	className,
	label,
	tooltip,
	name,
	readOnly,
	initialValue,
	required,
	value,
}) => {
	return (
		<Field name={name} initialValue={initialValue} value={value} type="radio">
			{({ input }) => (
				<Radio
					className={className}
					name={input.name}
					value={input.value}
					onChange={input.onChange}
					readOnly={readOnly}
					required={required}
					checked={input.checked}
					tooltip={tooltip}
				>
					{label}
				</Radio>
			)}
		</Field>
	);
};
