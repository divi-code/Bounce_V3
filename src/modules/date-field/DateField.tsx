import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { QuickNavType } from "@app/ui/calendar";
import { DateInterval } from "@app/ui/calendar/types";
import { DatePicker, DropdownPositionType } from "@app/ui/date-picker";
import { isRequired } from "@app/utils/validation";

type DateFieldType = {
	className?: string;
	value?: Date;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	label: string;
	quickNav?: Array<QuickNavType>;
	dropdownWidth?: string;
	dropdownPosition?: DropdownPositionType;
	min?: string;
	max?: string;
	selection?: DateInterval;
};

export const DateField: FC<DateFieldType & MaybeWithClassName> = ({
	className,
	name,
	placeholder,
	readOnly,
	value,
	required,
	label,
	quickNav,
	dropdownWidth,
	dropdownPosition,
	min,
	max,
	selection,
}) => {
	return (
		<Field name={name} value={value} validate={required ? isRequired : undefined}>
			{({ input }) => (
				<DatePicker
					className={className}
					name={input.name}
					initialValue={input.value}
					onChange={input.onChange}
					placeholder={placeholder}
					label={label}
					quickNav={quickNav}
					dropdownWidth={dropdownWidth}
					dropdownPosition={dropdownPosition}
					min={min}
					max={max}
					selection={selection}
					readOnly={readOnly}
					required={required}
				/>
			)}
		</Field>
	);
};
