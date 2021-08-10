import classNames from "classnames";
import React, { ChangeEvent, FC, useMemo, useState } from "react";
import { StrollableContainer, StrollerState } from "react-stroller";

import { uid } from "react-uid";

import { Label } from "@app/modules/select-token-field/Label";

import { ShortTokenInfo } from "@app/modules/select-token-field/types";
import { Button } from "@app/ui/button";
import { Pen } from "@app/ui/icons/pen";
import { Search } from "@app/ui/icons/search";
import { Input } from "@app/ui/input";
import { ScrollBar } from "@app/ui/stroller-components";

import styles from "./ListOfTokens.module.scss";

type ListOfTokensType = {
	active: ShortTokenInfo;
	name: string;
	options: Array<ShortTokenInfo>;
	onChange(item: any): void;
	onManage(): void;
};

const LINE_HEIGHT = 64;

const getDataWindow = <T extends any>(
	tableData: T[],
	height: number,
	scrollTop: number,
	clientHeight: number
) => {
	const n = Math.ceil(clientHeight / height);
	const start = Math.max(0, Math.floor(scrollTop / height));
	const n2 = Math.ceil(n / 2);
	const dataStart = Math.max(0, start - n2);

	return (fn: (a: { data: T[]; start: number; n: number }) => React.ReactNode) =>
		fn({
			data: tableData.slice(dataStart, dataStart + n + n),
			start: dataStart,
			n: n * 2,
		});
};

const SizeHolder: FC<{ lineCount: number }> = ({ lineCount, children }) => (
	<div
		style={{
			height: lineCount * LINE_HEIGHT,
			position: "relative",
			overflow: "hidden",
		}}
	>
		{children}
	</div>
);

export const ListOfTokens: FC<ListOfTokensType> = ({
	active,
	options,
	name,
	onChange,
	onManage,
}) => {
	const [searchValue, setSearch] = useState("");
	const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) =>
		setSearch(e.target.value?.toLowerCase());

	const tokens = useMemo(() => {
		if (!searchValue) {
			return options;
		}

		return options.filter(
			(option) =>
				option.title?.toLowerCase().includes(searchValue) ||
				option.key?.toLowerCase().includes(searchValue)
		);
	}, [options, searchValue]);

	return (
		<div className={styles.component}>
			<div>
				<Input
					name="search"
					type="text"
					placeholder="Search by name or paste address"
					before={<Search style={{ width: 19 }} />}
					onChange={handleOnSearch}
				/>
			</div>
			<div className={styles.scroll}>
				<StrollableContainer bar={ScrollBar} draggable>
					<SizeHolder lineCount={tokens.length}>
						<StrollerState>
							{({ clientHeight, scrollTop }) =>
								getDataWindow(
									tokens,
									LINE_HEIGHT,
									scrollTop,
									clientHeight
								)(({ data: windowData, start }) => (
									<ul className={styles.list}>
										{windowData.map((option, index) => {
											const checked = option === active;

											return (
												<li
													key={uid(option)}
													className={styles.item}
													style={{ top: (start + index) * LINE_HEIGHT, height: LINE_HEIGHT }}
												>
													<Label
														className={classNames(styles.input, checked && styles.active)}
														onChange={onChange}
														reference={option}
														title={option.title}
														currency={option.currency}
														img={option.img}
														id={uid(option)}
														name={name}
														checked={checked}
													/>
												</li>
											);
										})}
									</ul>
								))
							}
						</StrollerState>
					</SizeHolder>
				</StrollableContainer>
			</div>
			<div className={styles.footer}>
				<Button
					variant="text"
					color="primary-black"
					size="medium"
					iconBefore={<Pen width={24} style={{ width: 24, marginRight: 10 }} />}
					onClick={onManage}
				>
					Manage
				</Button>
			</div>
		</div>
	);
};
