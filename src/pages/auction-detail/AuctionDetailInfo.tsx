import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Currency } from "@app/modules/currency";
import { DescriptionList } from "@app/ui/description-list";

type AuctionDetailInfoType = {
	token: string;
	price: string;
	currency: string;
	amount: string;
};

export const AuctionDetailInfo: FC<AuctionDetailInfoType & MaybeWithClassName> = ({
	token,
	price,
	currency,
	amount,
}) => {
	return (
		<DescriptionList
			data={{
				"Bid swap ratio": (
					<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
						1{"\u00a0"}
						<Currency token={token} small />
						{"\u00a0"}={"\u00a0"}
						{price}
						{"\u00a0"}
						<Currency token={currency} small />
					</span>
				),
				"Total bid amount": (
					<span style={{ display: "grid", alignItems: "center", gridAutoFlow: "column" }}>
						{amount}
						{"\u00a0"}
						<Currency token={currency} small />
					</span>
				),
			}}
		/>
	);
};
