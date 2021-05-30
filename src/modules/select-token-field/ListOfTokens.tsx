import classNames from "classnames";
import React, { ChangeEvent, FC, useMemo, useRef, useState } from "react";
import { StrollableContainer } from "react-stroller";

import { uid } from "react-uid";

import { Label } from "@app/modules/select-token-field/Label";

import { ShortTokenInfo } from "@app/modules/select-token-field/types";
import { Button } from "@app/ui/button";
import { Pen } from "@app/ui/icons/pen";
import { Search } from "@app/ui/icons/search";
import { Input } from "@app/ui/input";
import { ScrollBar, VerticalScrollIndicator } from "@app/ui/stroller-components";

import styles from "./ListOfTokens.module.scss";

type ListOfTokensType = {
	active: ShortTokenInfo;
	name: string;
	options: Array<ShortTokenInfo>;
	onChange(item: any): void;
	onManage(): void;
};

export const ListOfTokens: FC<ListOfTokensType> = ({
	active,
	options,
	name,
	onChange,
	onManage,
}) => {
	const [searchValue, setSearch] = useState("");
	const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) =>
		setSearch(e.target.value.toLowerCase());

	const listOfTokens = useMemo(() => {
		if (!searchValue) {
			return options;
		}

		return options.filter(
			(option) =>
				option.title.toLowerCase().includes(searchValue) ||
				option.key.toLowerCase().includes(searchValue)
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
				<StrollableContainer bar={ScrollBar} draggable inBetween={<VerticalScrollIndicator />}>
					<ul className={styles.list}>
						{listOfTokens.map((option) => {
							const checked = option === active;

							return (
								<li key={uid(option)}>
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
