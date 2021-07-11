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
				swapRatio={`1 ETH = 10 ETH`}
				amount={100}
				allocation="No Limits"
				whitelist="Yes"
				duration="From - To"
				delay="No"
				type="Fixed Swap Auction"
			/>
		</div>
	);
};
