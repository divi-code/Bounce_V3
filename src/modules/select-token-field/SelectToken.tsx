import { TokenInfo } from "@uniswap/token-lists";
import classNames from "classnames";

import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useUID } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { Manage } from "@app/modules/select-token-field/Manage";
import { useTokenListControl } from "@app/modules/select-token-field/tokenControl";
import {
	ShortTokenInfo,
	ShortTokenListInfo,
	TokenListControl,
} from "@app/modules/select-token-field/types";
import { FieldFrame } from "@app/ui/field-frame";
import { Arrow } from "@app/ui/icons/arrow-down";
import { PopUpContainer } from "@app/ui/pop-up-container";

import { useAllTokens, useTokenList } from "@app/web3/api/tokens";

import { uriToHttp } from "@app/web3/api/tokens/ens/helpers";

import { Icon } from "../icon";

import { ListOfTokens } from "./ListOfTokens";
import styles from "./SelectToken.module.scss";
// import EMPTY from "./assets/empty.svg";

type SelectTokenType = {
	value?: string;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	options?: Array<ShortTokenInfo>;
	tokenList?: ShortTokenListInfo[];
	tokenListControl: TokenListControl;
	error?: string;
	onBlur?(): void;
	onChange(date: string): void;
	showArrow?: boolean;
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
	tokenList,
	tokenListControl,
	onBlur,
	error,
	showArrow = true,
}) => {
	const { popUp, close, open } = useControlPopUp();

	const valueContainerRef = useRef<HTMLInputElement>(null);

	const initialActive = options.find((item) => item.key === value);

	const defaultActive: ShortTokenInfo = initialActive
		? initialActive
		: placeholder
		? { key: undefined, title: undefined, currency: placeholder, img: undefined, source: undefined }
		: options[0];

	const [active, setActive] = useState<ShortTokenInfo>(defaultActive);
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

	useEffect(() => {
		if (!popUp.defined) {
			setManageOn(false);
		}
	}, [popUp.defined]);

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
						<div className={styles.value}>
							{active.img && <Icon src={active.img} />}
							<span>{active.currency}</span>
						</div>
					)}
					{showArrow && <Arrow position={!popUp.defined ? "bottom" : "top"} />}
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
						<Manage tokenLists={tokenList} tokenListControl={tokenListControl} />
					)}
					<popUp.DefinePresent />
				</PopUpContainer>
			) : null}
		</>
	);
};

const passAll = () => true;

export const SelectToken: FC<
	Omit<SelectTokenType, "options" | "tokenListControl" | "tokenList"> &
		MaybeWithClassName & {
			filter?(token: TokenInfo): boolean;
		}
> = ({ filter = passAll, ...props }) => {
	const tokenList = useTokenList();

	const tokenListControl = useTokenListControl();
	const { activeLists } = tokenListControl;

	const tokens = useAllTokens(
		useCallback((list) => activeLists.includes(list.name), [activeLists])
	);

	const options: ShortTokenInfo[] = useMemo(
		() =>
			tokens.filter(filter).map((token) => {
				return {
					key: token.address,
					title: token.name,
					currency: token.symbol,
					img: token.logoURI ? uriToHttp(token.logoURI)[0] : "",
					source: token.source,
				};
			}),
		[filter, tokens]
	);

	const convertedTokensList: ShortTokenListInfo[] = tokenList.map((value) => {
		return {
			key: value.name,
			name: value.name,
			img: value.logoURI,
			count: value.tokens.length,
		};
	});

	return (
		<SelectTokenView
			options={options}
			tokenList={convertedTokensList}
			tokenListControl={tokenListControl}
			{...props}
		/>
	);
};
