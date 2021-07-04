import classNames from "classnames";
import { FC } from "react";

import { FormSpy } from "react-final-form";

import { OTC_TYPE } from "@app/api/otc/const";
import { POOL_TYPE } from "@app/api/pool/const";
import { MaybeWithClassName } from "@app/helper/react/types";

import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { RadioField } from "@app/modules/radio-field";
import { SelectAuction } from "@app/modules/select-auction";
import { SelectOTC } from "@app/modules/select-otc";
import { PrimaryLink } from "@app/ui/button";

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
					className={styles.form}
					onSubmit={() => null}
					initialValues={{
						createType: OPERATION_TYPE.auction,
						auctionType: POOL_TYPE.fixed,
						otcType: OTC_TYPE.sell,
					}}
				>
					<Heading1 Component="h2" className={styles.title}>
						Create a Pool
					</Heading1>
					<Label Component="div" label="Select Creation Type">
						<RadioGroup count={2}>
							<RadioField
								name="createType"
								label="Auction"
								value="auction"
								tooltip="Create your preferred type of auction."
							/>
							<RadioField
								name="createType"
								label="OTC"
								value="otc"
								tooltip="(Over-the-Counter)  It  means  off-exchange  trading  is  done  directly  between  two  parties, without the supervision of an exchange."
							/>
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
								<PrimaryLink
									className={styles.button}
									size="large"
									href={`/create/auction/${props.values.auctionType}`}
								>
									Confirm
								</PrimaryLink>
							) : (
								<PrimaryLink
									className={styles.button}
									size="large"
									href={`/create/otc/${props.values.otcType}`}
								>
									Confirm
								</PrimaryLink>
							)
						}
					</FormSpy>
				</Form>
			</GutterBox>
		</div>
	);
};
