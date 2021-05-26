import classNames from "classnames";

import { Fragment, useRef, MouseEvent } from "react";
import { FocusOn } from "react-focus-on";

import { StrollableContainer } from "react-stroller";

import { MaybeWithClassName, WithChildren } from "@app/helper/react/types";

import { useWindowSize } from "@app/hooks/use-window-size";

import { ArrowBack } from "@app/ui/icons/arrow-back";
import { Close } from "@app/ui/icons/close";

import { ScrollBar } from "@app/ui/stroller-components";
import { Heading1 } from "@app/ui/typography";

import { Button } from "../button";
import { Shadow } from "../shadow";
import { suppressEvent } from "../utils/suppress-event";

import styles from "./PopUpContainer.module.scss";
import { PopupTeleporterSource } from "./teleporter";

import type { CSSProperties, FC } from "react";

type PopUpContainerType = {
	animated: boolean;
	visible: boolean;
	maxWidth?: number;
	title?: string;
	onClose(): void;
	scattered?: boolean;
	scrollable?: boolean;
	onBlur?(): void;
	onBack?(): void;
	withBack?: boolean;
	fixedHeight?: boolean;
};

type ComponentType = PopUpContainerType & MaybeWithClassName & WithChildren;

const Content: FC<WithChildren & { title?: string }> = ({ title, children }) => (
	// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
	<div
		onClick={suppressEvent}
		className={styles.content}
		style={
			{
				"--template": title ? "3.25rem calc(100% - 3.25rem)" : "100%",
			} as CSSProperties
		}
	>
		{title && (
			<Heading1 className={styles.title} Component="h2">
				{title}
			</Heading1>
		)}
		{children}
	</div>
);

export const PopUpContainer: FC<ComponentType & MaybeWithClassName> = ({
	className,
	visible,
	onClose,
	animated,
	children,
	maxWidth,
	title,
	scattered,
	scrollable = true,
	onBlur,
	withBack,
	onBack,
	fixedHeight,
}) => {
	const windowHeight = useWindowSize()[1];

	const Wrapper = scattered ? PopupTeleporterSource : Fragment;
	const shadowRef = useRef<HTMLDivElement>(null);

	const onShadowClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === shadowRef.current) {
			onClose();
		}
	};

	return (
		<Wrapper>
			<Shadow className={className} visible={visible} animated={animated} />
			<FocusOn autoFocus enabled={visible} onEscapeKey={onClose} onClickOutside={onClose}>
				<div data-autofocus-inside>
					{/* eslint-disable-next-line max-len */}
					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
					<div
						className={classNames(
							className,
							styles.component,
							visible && styles.visible,
							animated && styles.animation
						)}
						tabIndex={-1}
						role="dialog"
						onClick={onShadowClick}
						style={{ "--window-height": `${windowHeight}px` } as CSSProperties}
						onBlur={onBlur}
						ref={shadowRef}
					>
						<div
							className={classNames(styles.container, fixedHeight && styles.fixedHeight)}
							style={{ maxWidth: maxWidth ? `${maxWidth / 16}rem` : "none" }}
						>
							<Button
								className={styles.close}
								icon={<Close />}
								color="primary-black"
								variant="text"
								onClick={onClose}
							>
								Close
							</Button>
							{withBack && (
								<Button
									className={styles.back}
									icon={<ArrowBack style={{ width: 26 }} />}
									color="primary-black"
									variant="text"
									onClick={onBack}
								>
									Back
								</Button>
							)}
							{scrollable ? (
								<StrollableContainer bar={ScrollBar} draggable>
									<Content title={title}>{children}</Content>
								</StrollableContainer>
							) : (
								<Content title={title}>{children}</Content>
							)}
						</div>
					</div>
				</div>
			</FocusOn>
		</Wrapper>
	);
};
