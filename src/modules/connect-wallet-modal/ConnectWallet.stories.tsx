import { PopUpContainer } from "@app/ui/pop-up-container";

import { ConnectWallet } from "./ConnectWalletModal";

const nothing = () => null;

export const Default = () => {
	return (
		<div>
			<PopUpContainer
				animated={true}
				visible={true}
				onClose={nothing}
				maxWidth={640}
				scrollable={false}
			>
				<ConnectWallet disable={false} onMetamask={nothing} onWalletConnect={nothing} />
			</PopUpContainer>
		</div>
	);
};
