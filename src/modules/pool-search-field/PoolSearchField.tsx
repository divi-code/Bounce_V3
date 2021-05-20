import React, { FC, useMemo } from "react";
import { Form, useField, useForm, useFormState } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { CheckboxField } from "@app/modules/checkbox-field";

import { TextField } from "@app/modules/text-field";

import { Button } from "@app/ui/button";
import { Search } from "@app/ui/icons/search";

import { PoolSearch } from "./PoolSearch";
import styles from "./PoolSearch.module.scss";

type PoolSearchFieldType = {
	className?: string;
	value?: string;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
};

const ToggableField: FC<{ name: string; label: string }> = ({ name, label }) => {
	const checkName = `${name}:check`;
	const field = useFormState().values;

	return (
		<div className={styles.checkbox}>
			<CheckboxField label={label} name={checkName} />
			{field[checkName] && (
				<TextField
					className={styles.search}
					name={name}
					type="text"
					before={<Search style={{ width: 17.5 }} />}
				/>
			)}
		</div>
	);
};

const EMPTY_OBJECT = {};

const poolSearchFields = {
	id: "Pool ID",
	name: "Pool Name",
	creator: "Creator Wallet Address",
};

const processValues = (values: Record<string, any>): Record<string, any> => {
	return Object.keys(values)
		.filter((key) => !key.includes(":check"))
		.reduce((acc, key) => {
			if (values[`${key}:check`]) {
				acc[key] = values[key];
			}

			return acc;
		}, {});
};

export const PoolSearchField: FC<PoolSearchFieldType & MaybeWithClassName> = ({
	className,
	name,
	placeholder,
	value,
}) => {
	const field = useField(name, { value });

	const fieldValue: any = field.input.value || EMPTY_OBJECT;

	const subValues = useMemo(
		() => ({
			...fieldValue,
			"id:check": Boolean(fieldValue.id),
			"name:check": Boolean(fieldValue.name),
			"creator:check": Boolean(fieldValue.creator),
		}),
		[fieldValue]
	);

	const form = useForm();

	const displayValue = Object.entries(poolSearchFields)
		.filter(([k]) => fieldValue[k])
		.map(([, v]) => v)
		.join(", ");

	const popupControl = useControlPopUp();

	return (
		<PoolSearch
			className={className}
			name={name}
			placeholder={placeholder}
			value={displayValue}
			popupControl={popupControl}
		>
			<Form
				initialValues={subValues}
				onSubmit={(values) => {
					form.change(name, processValues(values));
					popupControl.close();
				}}
			>
				{({ handleSubmit, form: { reset } }) => (
					<form className={styles.form} onSubmit={handleSubmit}>
						{Object.entries(poolSearchFields).map(([name, label]) => (
							<ToggableField name={name} label={label} key={name} />
						))}
						<div className={styles.navigation}>
							<Button
								variant="outlined"
								size="large"
								color="primary-white"
								onClick={() => reset({})}
							>
								Clear All
							</Button>
							<Button variant="contained" size="large" color="primary-black" submit>
								Confirm
							</Button>
						</div>
					</form>
				)}
			</Form>
		</PoolSearch>
	);
};
