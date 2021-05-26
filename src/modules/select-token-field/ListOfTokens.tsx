import classNames from "classnames";
import React, { FC, useRef } from "react";
import { StrollableContainer } from "react-stroller";

import { uid } from "react-uid";

import { Label } from "@app/modules/select-token-field/Label";

import { Button } from "@app/ui/button";
import { Pen } from "@app/ui/icons/pen";
import { Search } from "@app/ui/icons/search";
import { Input } from "@app/ui/input";
import { ScrollBar, VerticalScrollIndicator } from "@app/ui/stroller-components";

import styles from "./ListOfTokens.module.scss";

type ListOfTokensType = {
	active: string;
	name: string;
	options: Array<any>;
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
	const activeRef = useRef<HTMLInputElement>(null);

	return (
		<div className={styles.component}>
			<div>
				<Input
					name="search"
					type="text"
					placeholder="Search by name or paste address"
					before={<Search style={{ width: 19 }} />}
				/>
			</div>
			<div className={styles.scroll}>
				<StrollableContainer bar={ScrollBar} draggable inBetween={<VerticalScrollIndicator />}>
					<ul className={styles.list}>
						{options.map((option, index) => {
							const checked = option === active;

							return (
								<li key={option.key}>
									<Label
										className={classNames(styles.input, checked && styles.active)}
										ref={checked || (!active && index === 0) ? activeRef : undefined}
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
