import { SelectTokenView } from "./SelectToken";

const defaultOptions = [
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

export const Default = () => (
	<SelectTokenView
		placeholder="From"
		name="date"
		onChange={() => null}
		options={defaultOptions}
		tokenList={[]}
		tokenListControl={{ activeLists: [], change: (listKey: string, change: boolean) => null }}
	/>
);

export const InitialValue = () => (
	<SelectTokenView
		placeholder="From"
		name="date"
		value="eth7"
		onChange={() => null}
		options={defaultOptions}
		tokenList={[]}
		tokenListControl={{ activeLists: [], change: (listKey: string, change: boolean) => null }}
	/>
);

export const ReadOnly = () => (
	<SelectTokenView
		placeholder="From"
		name="date"
		value="eth7"
		onChange={() => null}
		readOnly
		options={defaultOptions}
		tokenList={[]}
		tokenListControl={{ activeLists: [], change: (listKey: string, change: boolean) => null }}
	/>
);
