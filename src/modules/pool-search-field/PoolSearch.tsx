import classNames from "classnames";

import React, { FC, ReactNode } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import { PopupControlType } from "@app/hooks/use-control-popup";
import { FieldFrame } from "@app/ui/field-frame";
import { Arrow } from "@app/ui/icons/arrow-down";
import { PopUpContainer } from "@app/ui/pop-up-container";

import styles from "./PoolSearch.module.scss";

type PoolSearchType = {
	name: string;
	value: ReactNode;
	placeholder?: string;
	popupControl: PopupControlType;
	readOnly?: boolean;
};

export const PoolSearch: FC<PoolSearchType & MaybeWithClassName> = ({
	className,
	value,
	placeholder,
	children,
	readOnly,
	popupControl: { open, close, popUp },
}) => {
	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
		<div className={classNames(className, styles.component)}>
			<FieldFrame
				className={styles.toggle}
				focus={popUp.defined}
				placeholder={!value}
				onClick={!readOnly ? open : () => null}
			>
				{value ? value : placeholder}
				<Arrow style={{ transform: !popUp.defined ? "rotate(180deg)" : "rotate(0)" }} />
			</FieldFrame>
			{popUp.defined ? (
				<PopUpContainer
					animated={popUp.present}
					visible={popUp.defined}
					onClose={close}
					maxWidth={640}
					title="Pool information"
					scattered
				>
					<div className={styles.modal}>{children}</div>
					<popUp.DefinePresent />
				</PopUpContainer>
			) : null}
		</div>
	);
};
