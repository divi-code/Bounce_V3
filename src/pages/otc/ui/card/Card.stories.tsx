import { POOL_STATUS } from "@app/utils/pool";

import { Card } from "./Card";

const settings = {
	href: "/",
	id: 23,
	name: "Monica Sell OTC",
	address: "0xF2e62668f6Fd9Bb71fc4E80c44CeF32940E27a45",
	type: "Sell",
	tokenSymbol: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
	token: "ETH",
	currency: "USDT / ETH",
	price: 33.5,
};

export const Default = () => {
	return (
		<div style={{ backgroundColor: "#E5E5E5", padding: 40 }}>
			<div style={{ width: 400 }}>
				<Card {...settings} status={POOL_STATUS.LIVE} fill={40} />
			</div>
		</div>
	);
};

export const Filled = () => {
	return (
		<div style={{ backgroundColor: "#E5E5E5", padding: 40 }}>
			<div style={{ width: 400 }}>
				<Card {...settings} status={POOL_STATUS.FILLED} fill={100} />
			</div>
		</div>
	);
};

export const Closed = () => {
	return (
		<div style={{ backgroundColor: "#E5E5E5", padding: 40 }}>
			<div style={{ width: 400 }}>
				<Card {...settings} status={POOL_STATUS.CLOSED} fill={40} />
			</div>
		</div>
	);
};
