export const composeValidators = (...validators: any[]) => (value: string) =>
	validators.reduce((error, validator) => error || validator(value), undefined);

export function isRequired<T>(value: T): string | undefined {
	return value ? undefined : "This field is required.";
}

export const isNotGreaterThan = (max: number) => (value: string): string | undefined => {
	return +value > max ? "You have exceeded the limit." : undefined;
};

export const isEqualZero = (value: string): string | undefined => {
	return +value === 0 ? "Should be a more than 0" : undefined;
};

export const isNotLongerThan = (max: number) => (value: string): string | undefined => {
	return value.length > max ? `Should be a less than ${max} symbols` : undefined;
};

export function isValidEmail(value: string): string | undefined {
	return /\S+@\S+\.\S+/.test(value) ? undefined : "Invalid email address.";
}

export function isValidUsername(value: string): string | undefined {
	return value.startsWith("@") ? undefined : "Start your input with @";
}

export function isDecimalNumber(value: string): string | undefined {
	return value.match(/[^\d^.]/) ? "Should be a number" : undefined;
}
