import { walletConversion } from "@app/utils/convertWallet";

import { ConfirmationView } from "./Confirmation";

export const Default = () => {
	return (
		<div>
			<ConfirmationView
				name="Test"
				address={walletConversion("0xF2e62668f6Fd9Bb71fc4E80c44CeF32940E27a45")}
				tokenFrom="ETH"
				declaim="18"
				tokenTo="ETH"
				unitPrice={`1 ETH = 10 ETH`}
				amount={"100 ETH"}
				whitelist="Yes"
				start="Start"
				type="Fixed Swap Auction"
			/>
		</div>
	);
};
