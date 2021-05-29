import { Alert, ALERT_TYPE } from "./Alert";

const settings = {
	title: "The auction is still live.",
	text: "Please wait patiently until your auction is filled or closed.",
};

export const Default = () => (
	<div>
		<Alert type={ALERT_TYPE.default} {...settings} />
	</div>
);

export const Error = () => (
	<div>
		<Alert type={ALERT_TYPE.error} {...settings} />
	</div>
);

export const Success = () => (
	<div>
		<Alert type={ALERT_TYPE.success} {...settings} />
	</div>
);
