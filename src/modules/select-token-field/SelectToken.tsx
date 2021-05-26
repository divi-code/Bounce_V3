import classNames from "classnames";

import React, { CSSProperties, FC, useCallback, useEffect, useRef, useState } from "react";

import { useUID } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { Manage } from "@app/modules/select-token-field/Manage";
import { FieldFrame } from "@app/ui/field-frame";
import { Arrow } from "@app/ui/icons/arrow-down";
import { PopUpContainer } from "@app/ui/pop-up-container";

import { useTokenList } from "@app/web3/api/tokens";
import { useDefaultTokens } from "@app/web3/api/tokens/use-default-token-list";

import { useConnected } from "@app/web3/hooks/use-web3";

import { ListOfTokens } from "./ListOfTokens";
import styles from "./SelectToken.module.scss";

type SelectTokenType = {
	value?: string;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	options?: Array<any>;
	tokens?: Array<any>;
	error?: string;
	onBlur?(): void;
	onChange(date: string): void;
};

export const SelectTokenView: FC<SelectTokenType & MaybeWithClassName> = ({
	name,
	value,
	onChange,
	placeholder,
	className,
	readOnly,
	required,
	options,
	tokens,
	onBlur,
	error,
}) => {
	const { popUp, close, open } = useControlPopUp();

	const valueContainerRef = useRef<HTMLInputElement>(null);

	const initialActive = options.find((item) => item.key === value);

	const defaultActive = initialActive
		? initialActive
		: placeholder
		? { key: undefined, title: undefined, currency: placeholder, img: undefined }
		: options[0];

	const [active, setActive] = useState(defaultActive);
	const [changed, setChanged] = useState(false);

	const groupName = useUID();

	const handleChange = useCallback(
		(item) => {
			setActive(item);
			setChanged(true);
			close();
		},
		[close]
	);

	//result changed: trigger changes
	useEffect(() => {
		if (changed && !popUp.defined && onChange) {
			// target is the only thing react-final-form needs
			onChange({ target: valueContainerRef.current } as any);
		}
	}, [active, changed, onChange, popUp]);

	const [manageOn, setManageOn] = useState(false);

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
		<>
			<div className={classNames(className, styles.component)}>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
				<input
					name={name}
					type="hidden"
					value={active ? active.key : ""}
					readOnly={readOnly}
					required={required}
					ref={valueContainerRef}
				/>
				<FieldFrame
					className={styles.toggle}
					focus={popUp.defined}
					placeholder={active.key === undefined}
					error={error}
					onClick={!readOnly ? open : () => null}
				>
					{active && (
						<span
							className={styles.value}
							style={
								{
									"--icon": `url("${active.img}")`,
									"--show-icon": active.img !== undefined ? "block" : "none",
								} as CSSProperties
							}
						>
							{active.currency}
						</span>
					)}
					<Arrow style={{ transform: !popUp.defined ? "rotate(180deg)" : "rotate(0)" }} />
				</FieldFrame>
			</div>
			{popUp.defined ? (
				<PopUpContainer
					animated={popUp.present}
					visible={popUp.defined}
					onClose={close}
					maxWidth={640}
					title={!manageOn ? "Select a token" : "Manage"}
					scrollable={false}
					onBlur={onBlur}
					onBack={() => setManageOn(false)}
					withBack={manageOn}
					fixedHeight={true}
				>
					{!manageOn ? (
						<ListOfTokens
							active={active}
							onChange={handleChange}
							onManage={() => setManageOn(true)}
							name={groupName}
							options={options}
						/>
					) : (
						<Manage tokens={tokens} onChange={() => null} />
					)}
					<popUp.DefinePresent />
				</PopUpContainer>
			) : null}
		</>
	);
};

export const SelectToken: FC<Omit<SelectTokenType, "options">> = (props) => {
	const active = useConnected();
	const tokens = useDefaultTokens();
	const allTokens = useTokenList();

	const options = !active
		? []
		: tokens.map((token) => {
				return {
					key: token.address,
					title: token.name,
					currency: token.symbol,
					img: token.logoURI,
				};
		  });

	const convertedTokens = Object.values(allTokens).map((value) => {
		return {
			key: value.name,
			name: value.name,
			img: value.logoURI,
			count: value.tokens.length,
		};
	});

	console.log(convertedTokens);

	return <SelectTokenView options={options} tokens={convertedTokens} {...props} />;
};
