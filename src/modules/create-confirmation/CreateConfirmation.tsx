import { FC, ReactNode, useCallback, useState } from "react";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";
import { Button, PrimaryButton } from "@app/ui/button";

import { GutterBox } from "@app/ui/gutter-box";
import { Close } from "@app/ui/icons/close";
import { Spinner } from "@app/ui/spinner";
import { Heading2 } from "@app/ui/typography";

import styles from "./CreateConfirmation.module.scss";

type CreateConfirmationType = {
	alert?: ReactNode;
	moveBack(): void;
	onComplete(): void;
};

export const CreateConfirmation: FC<CreateConfirmationType & MaybeWithClassName & WithChildren> = ({
	className,
	alert,
	moveBack,
	onComplete,
	children,
}) => {
	const [loading, setLoading] = useState(false);

	const handleOnComplete = useCallback(async () => {
		setLoading(true);

		try {
			await onComplete();
		} finally {
			setLoading(false);
		}
	}, [onComplete]);

	return (
		<section className={className}>
			<GutterBox>
				<div className={styles.content}>
					<Heading2 Component="h2" className={styles.title}>
						Creation confirmation
					</Heading2>
					<Button
						className={styles.close}
						variant="text"
						color="primary-black"
						icon={<Close width={24} height="auto" />}
						onClick={moveBack}
					>
						Close
					</Button>
					<div className={styles.body}>{children}</div>
					{alert}
					<PrimaryButton
						className={styles.submit}
						onClick={handleOnComplete}
						disabled={loading}
						size="large"
					>
						{loading ? <Spinner size="small" /> : "Confirm"}
					</PrimaryButton>
				</div>
			</GutterBox>
		</section>
	);
};
