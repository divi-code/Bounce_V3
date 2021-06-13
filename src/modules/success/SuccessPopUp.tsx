import { RC } from "@app/helper/react/types";
import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { Button } from "@app/ui/button";
import { PopUpContainer } from "@app/ui/pop-up-container";

import styles from "./Success.module.scss";

export const SuccessPopUp: RC<{
	text?: string;
	control: ScatteredContinuousState<boolean>;
	close(): void;
}> = ({ text, close, control }) => {
	return (
		<PopUpContainer
			animated={control.present}
			visible={control.defined}
			onClose={close}
			maxWidth={640}
			scrollable={false}
		>
			<div className={styles.component}>
				<h2 className={styles.title}>Success !</h2>
				{text && <p className={styles.text}>{text}</p>}
				<Button
					className={styles.button}
					variant="contained"
					size="large"
					color="primary-black"
					onClick={close}
				>
					Close
				</Button>
			</div>
			<control.DefinePresent />
		</PopUpContainer>
	);
};
