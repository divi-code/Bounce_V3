import { TokenInfo } from "@uniswap/token-lists";
import { FC, useCallback, useEffect } from "react";
import { useForm, useFormState, FormSpy } from "react-final-form";

import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { SelectTokenField } from "@app/modules/select-token-field";
import { TextField } from "@app/modules/text-field";

import { NavLink, PrimaryButton } from "@app/ui/button";
import { RightArrow2 } from "@app/ui/icons/arrow-right-2";

import styles from "./ProvideTokenInformation.module.scss";

type EffectorType = {
	address?: string;
	decimal?: number;
	onTokenChange(token: string): void;
};

const Effector: FC<EffectorType> = ({ decimal, address, onTokenChange }) => {
	const form = useForm();
	const {
		values: { tokenFrom },
	} = useFormState();

	useEffect(() => {
		onTokenChange(tokenFrom);
	}, [onTokenChange, tokenFrom]);

	useEffect(() => {
		form.batch(() => {
			form.change("decimal", decimal);
			form.change("address", address);
		});
	}, [decimal, address, form]);

	return null;
};

type ProvideTokenInformationType = EffectorType & {
	href: string;
	initialState: any;
	withoutEth?: boolean;
	onSubmit(values): void;
};

export const ProvideTokenInformation: FC<ProvideTokenInformationType> = ({
	onSubmit,
	onTokenChange,
	decimal,
	address,
	initialState,
	href,
	withoutEth,
}) => {
	const notEtherium = useCallback((token: TokenInfo) => token.symbol !== "ETH", []);

	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={initialState}>
			<Effector decimal={decimal} address={address} onTokenChange={onTokenChange} />
			<Label className={styles.label} Component="div" label="Token" tooltip="Select a ERC20 token.">
				<SelectTokenField
					name="tokenFrom"
					placeholder="Select a token"
					filter={withoutEth ? notEtherium : undefined}
					required
				/>
			</Label>
			<Label Component="label" className={styles.label} label="Token contact address">
				<TextField
					type="text"
					name="address"
					placeholder="0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c0000"
					readOnly
					required
				/>
			</Label>
			<Label Component="label" className={styles.label} label="Token decimal">
				<TextField type="text" name="decimal" placeholder="0" readOnly required />
			</Label>
			<NavLink
				className={styles.link}
				href={href}
				size="medium"
				variant="text"
				color="dark-grey"
				weight="regular"
			>
				View on Etherscan
			</NavLink>
			<FormSpy>
				{(form) => (
					<PrimaryButton
						className={styles.submit}
						size="large"
						iconAfter={<RightArrow2 width={18} style={{ marginLeft: 12 }} />}
						submit
					>
						{initialState && form.dirty ? "Save" : "Next Step"}
					</PrimaryButton>
				)}
			</FormSpy>
		</Form>
	);
};
