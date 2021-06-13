import { RC } from "@app/helper/react/types";
import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { Button } from "@app/ui/button";
import { PopUpContainer } from "@app/ui/pop-up-container";

import styles from "./Failed.module.scss";

export const FailedPopUp: RC<{
	control: ScatteredContinuousState<boolean>;
	onClick(): void;
	close(): void;
}> = ({ onClick, close, control }) => {
	return (
		<PopUpContainer
			animated={control.present}
			visible={control.defined}
			onClose={close}
			maxWidth={640}
			scrollable={false}
		>
			<div className={styles.component}>
				<h2 className={styles.title}>Oops!</h2>
				<p className={styles.text}>Action failed, please try again</p>
				<div className={styles.buttons}>
					<Button variant="outlined" size="large" color="primary-black" onClick={close}>
						Close
					</Button>
					<Button variant="contained" size="large" color="primary-black" onClick={onClick}>
						Try Again
					</Button>
				</div>
			</div>
			<control.DefinePresent />
		</PopUpContainer>
	);
};
