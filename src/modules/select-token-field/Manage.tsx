import React, { useRef, useState } from "react";

import { StrollableContainer } from "react-stroller";

import { uid } from "react-uid";

import { Button } from "@app/ui/button";

import { Search } from "@app/ui/icons/search";
import { Input } from "@app/ui/input";
import { ScrollBar, VerticalScrollIndicator } from "@app/ui/stroller-components";

import styles from "./Manage.module.scss";
import { Toggle } from "./Toggle";

enum TOGGLES {
	list = "list",
	tokens = "tokens",
}

export const Manage = ({ tokens, onChange }) => {
	const [toggle, setToggle] = useState(TOGGLES.list);

	const checked = false;

	const activeRef = useRef<HTMLInputElement>(null);

	return (
		<div className={styles.component}>
			<div className={styles.header}>
				<Button
					size="large"
					onClick={() => setToggle(TOGGLES.list)}
					color={toggle === TOGGLES.list ? "primary-black" : "primary-white"}
					variant={toggle === TOGGLES.list ? "contained" : "outlined"}
				>
					List
				</Button>
				<Button
					size="large"
					onClick={() => setToggle(TOGGLES.tokens)}
					color={toggle === TOGGLES.tokens ? "primary-black" : "primary-white"}
					variant={toggle === TOGGLES.tokens ? "contained" : "outlined"}
					disabled
				>
					Tokens
				</Button>
				<div className={styles.search}>
					<Input
						name="search"
						type="text"
						placeholder={
							toggle === TOGGLES.list
								? "https: // or ipfs:// or ENS name"
								: toggle === TOGGLES.tokens
								? "0*0000"
								: undefined
						}
						before={toggle === TOGGLES.list ? <Search style={{ width: 19 }} /> : undefined}
					/>
				</div>
			</div>
			{toggle === TOGGLES.list && (
				<div className={styles.scroll}>
					<StrollableContainer bar={ScrollBar} draggable inBetween={<VerticalScrollIndicator />}>
						<ul className={styles.list}>
							{tokens.map((item) => (
								<li key={item.key}>
									<Toggle
										id={uid(item)}
										count={item.count}
										img={item.img}
										name={item.name}
										checked={checked}
										reference={checked ? activeRef : undefined}
										onChange={onChange}
									/>
								</li>
							))}
						</ul>
					</StrollableContainer>
				</div>
			)}
			{toggle === TOGGLES.tokens && <div>Coming Soon</div>}
		</div>
	);
};
