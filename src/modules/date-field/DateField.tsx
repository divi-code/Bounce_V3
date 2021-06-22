import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { DateInterval } from "@app/ui/calendar/types";
import { DatePicker, DropdownPositionType, QuickNavType } from "@app/ui/date-picker";
import { isDateRequired } from "@app/utils/validation";

type DateFieldType = {
	className?: string;
	value?: Date;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	labels: string[];
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
	labels,
	quickNav,
	dropdownWidth,
	dropdownPosition,
	min,
	max,
	selection,
}) => {
	return (
		<Field name={name} value={value} validate={required ? isDateRequired : undefined}>
			{({ input, meta }) => (
				<DatePicker
					className={className}
					name={input.name}
					initialValue={input.value}
					onChange={input.onChange}
					onBlur={input.onBlur}
					placeholder={placeholder}
					labels={labels}
					quickNav={quickNav}
					dropdownWidth={dropdownWidth}
					dropdownPosition={dropdownPosition}
					min={min}
					max={max}
					selection={selection}
					readOnly={readOnly}
					required={required}
					error={(meta.error && meta.touched ? meta.error : undefined) || meta.submitError}
				/>
			)}
		</Field>
	);
};
