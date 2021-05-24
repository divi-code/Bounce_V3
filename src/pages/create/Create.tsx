import classNames from "classnames";
import { FC } from "react";

import { Form, FormSpy } from "react-final-form";

import { OTC_TYPE } from "@app/api/otc/const";
import { POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { SelectAuction } from "@app/modules/select-auction";
import { SelectOTC } from "@app/modules/select-otc";
import { NavLink } from "@app/ui/button";

import { GutterBox } from "@app/ui/gutter-box";
import { RadioGroup } from "@app/ui/radio-group";

import { Heading1 } from "@app/ui/typography";

import styles from "./Create.module.scss";

enum OPERATION_TYPE {
	auction = "auction",
	otc = "auction",
}

export const Create: FC<MaybeWithClassName> = ({ className }) => {
	return (
		<div className={classNames(className, styles.component)}>
			<GutterBox>
				<Form
					onSubmit={() => null}
					initialValues={{
						createType: OPERATION_TYPE.auction,
						auctionType: POOL_TYPE.fixed,
						otcType: OTC_TYPE.sell,
					}}
				>
					{({ handleSubmit }) => (
						<form onSubmit={handleSubmit} className={styles.form}>
							<Heading1 Component="h2" className={styles.title}>
								Create a Pool
							</Heading1>
							<Label Component="div" label="Select Creation Type">
								<RadioGroup count={2}>
									<RadioField
										name="createType"
										label="Auction"
										value="auction"
										tooltip="Create new item"
									/>
									<RadioField name="createType" label="OTC" value="otc" tooltip="Create new item" />
								</RadioGroup>
							</Label>
							<FormSpy subscription={{ values: true }}>
								{(props) => (
									<>
										{props.values.createType === OPERATION_TYPE.auction ? (
											<SelectAuction name="auctionType" />
										) : (
											<SelectOTC name="otcType" />
										)}
									</>
								)}
							</FormSpy>
							<FormSpy subscription={{ values: true }}>
								{(props) =>
									props.values.createType === OPERATION_TYPE.auction ? (
										<NavLink
											className={styles.button}
											size="large"
											color="primary-black"
											variant="contained"
											href={`/create/auction/${props.values.auctionType}`}
										>
											Confirm
										</NavLink>
									) : (
										<NavLink
											className={styles.button}
											size="large"
											color="primary-black"
											variant="contained"
											href={`/create/otc/${props.values.otcType}`}
										>
											Confirm
										</NavLink>
									)
								}
							</FormSpy>
						</form>
					)}
				</Form>
			</GutterBox>
		</div>
	);
};
