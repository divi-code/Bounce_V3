import { TokenInfo } from "@uniswap/token-lists";
import React, { ChangeEvent, FC, useRef, useState } from "react";

import { StrollableContainer } from "react-stroller";

import { uid } from "react-uid";

import { ShortTokenListInfo, TokenListControl } from "@app/modules/select-token-field/types";
import { Button } from "@app/ui/button";

import { Search } from "@app/ui/icons/search";
import { Input } from "@app/ui/input";
import { ScrollBar, VerticalScrollIndicator } from "@app/ui/stroller-components";

import { queryERC20Token } from "@app/web3/api/eth/api";
import { useLocallyDefinedTokens } from "@app/web3/api/tokens/local-tokens";

import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Manage.module.scss";
import { Toggle } from "./Toggle";

enum TOGGLES {
	list = "list",
	tokens = "tokens",
}

export const Manage: FC<{
	tokenLists: ShortTokenListInfo[];
	tokenListControl: TokenListControl;
}> = ({ tokenLists, tokenListControl }) => {
	const [toggle, setToggle] = useState(TOGGLES.list);
	const [localTokens, setLocalTokens] = useLocallyDefinedTokens();
	const provider = useWeb3Provider();
	const chainId = useChainId();

	const addTokenByAddress = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const address = e.target.value;

		const newToken: TokenInfo = {
			chainId,
			name: `custom token`,
			...(await queryERC20Token(provider, address, chainId)),
		};
		setLocalTokens([...localTokens, newToken]);
	};

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
				>
					Tokens
				</Button>
				{toggle === TOGGLES.tokens && (
					<div className={styles.search}>
						<Input
							name="search"
							type="text"
							placeholder={"0x0000 address"}
							onChange={addTokenByAddress}
						/>
					</div>
				)}
			</div>
			{toggle === TOGGLES.list && (
				<div className={styles.scroll}>
					<StrollableContainer bar={ScrollBar} draggable inBetween={<VerticalScrollIndicator />}>
						<ul className={styles.list}>
							{tokenLists.map((item) => (
								<li key={item.key}>
									<Toggle
										id={uid(item)}
										count={item.count}
										img={item.img}
										name={item.name}
										checked={tokenListControl.activeLists.includes(item.key)}
										reference={item.key}
										onChange={tokenListControl.change}
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
