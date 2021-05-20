import classNames from "classnames";

import React, { CSSProperties, FC, useCallback, useEffect, useRef, useState } from "react";

import { StrollableContainer } from "react-stroller";
import { uid, useUID } from "react-uid";

import { MaybeWithClassName } from "@app/helper/react/types";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { FieldFrame } from "@app/ui/field-frame";
import { Arrow } from "@app/ui/icons/arrow-down";
import { Search } from "@app/ui/icons/search";
import { Input } from "@app/ui/input";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { ScrollBar, VerticalScrollIndicator } from "@app/ui/stroller-components";

import { Label } from "./Label";
import styles from "./SelectToken.module.scss";

type SelectTokenType = {
	value?: string;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	onChange(date: string): void;
};

export const SelectToken: FC<SelectTokenType & MaybeWithClassName> = ({
	name,
	value,
	onChange,
	placeholder,
	className,
	readOnly,
	required,
}) => {
	const options = [
		{
			currency: "ETH",
			key: "eth1",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
		{
			currency: "ETH2",
			key: "eth2",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
		{
			currency: "ETH3",
			key: "eth3",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
		{
			currency: "ETH4",
			key: "eth4",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
		{
			currency: "ETH5",
			key: "eth5",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
		{
			currency: "ETH6",
			key: "eth6",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
		{
			currency: "ETH7",
			key: "eth7",
			img: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
			title: "ETH",
		},
	];

	const { popUp, close, open } = useControlPopUp();

	const activeRef = useRef<HTMLInputElement>(null);
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

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
		<div className={classNames(className, styles.component)} tabIndex={0}>
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
				onClick={open}
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
			{popUp.defined ? (
				<PopUpContainer
					animated={popUp.present}
					visible={popUp.defined}
					onClose={close}
					maxWidth={640}
					title="Select a token"
				>
					<div className={styles.modal}>
						<div>
							<Input
								name="search"
								type="text"
								placeholder="Search by name or paste address"
								before={<Search style={{ width: 19 }} />}
							/>
						</div>
						<div className={styles.scroll}>
							<StrollableContainer
								bar={ScrollBar}
								draggable
								inBetween={<VerticalScrollIndicator />}
							>
								<ul className={styles.list}>
									{options.map((option, index) => {
										const checked = option === active;

										return (
											<li key={option.key}>
												<Label
													className={classNames(styles.input, checked && styles.active)}
													ref={checked || (!active && index === 0) ? activeRef : undefined}
													onChange={handleChange}
													reference={option}
													title={option.title}
													currency={option.currency}
													img={option.img}
													id={uid(option)}
													name={groupName}
													checked={checked}
												/>
											</li>
										);
									})}
								</ul>
							</StrollableContainer>
						</div>
					</div>
					<popUp.DefinePresent />
				</PopUpContainer>
			) : null}
		</div>
	);
};
