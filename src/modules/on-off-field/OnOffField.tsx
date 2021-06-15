import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { OnOff } from "@app/ui/on-off";

type OnOffFieldType = {
	name: string;
	readOnly?: boolean;
	initialValue?: any;
	value?: any;
	required?: boolean;
};

export const OnOffField: FC<OnOffFieldType & MaybeWithClassName> = ({
	className,
	name,
	readOnly,
	initialValue,
	required,
	value,
}) => {
	return (
		<Field name={name} initialValue={initialValue} value={value} type="checkbox">
			{({ input }) => (
				<OnOff
					data-test={input}
					className={className}
					name={input.name}
					value={input.value}
					onChange={input.onChange}
					readOnly={readOnly}
					required={required}
					checked={input.checked}
				/>
			)}
		</Field>
	);
};
