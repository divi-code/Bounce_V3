import classNames from "classnames";
import { StrollerState } from "react-stroller";

import styles from "./Indicator.module.scss";

export const VerticalScrollIndicator = () => {
	return (
		<StrollerState>
			{({ scrollTop, scrollHeight, clientHeight }) => (
				<>
					<span
						className={classNames(
							styles.indicator,
							styles.vertical,
							styles.top,
							scrollTop === 0 && styles.hidden
						)}
					/>
					<span
						className={classNames(
							styles.indicator,
							styles.vertical,
							styles.bottom,
							scrollTop + clientHeight >= scrollHeight && styles.hidden
						)}
					/>
				</>
			)}
		</StrollerState>
	);
};

export const HorizontalScrollIndicator = () => (
	<StrollerState>
		{({ scrollLeft, scrollWidth, clientWidth }) => (
			<>
				<span
					className={classNames(
						styles.indicator,
						styles.left,
						styles.horizontal,
						scrollLeft === 0 && styles.hidden
					)}
				/>
				<span
					className={classNames(
						styles.indicator,
						styles.horizontal,
						styles.right,
						scrollLeft + clientWidth >= scrollWidth && styles.hidden
					)}
				/>
			</>
		)}
	</StrollerState>
);
