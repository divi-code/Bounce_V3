export const composeValidators = (...validators: any[]) => (value: string) =>
	validators.reduce((error, validator) => error || validator(value), undefined);

export function isRequired(value: string): string | undefined {
	return value ? undefined : "This field is required.";
}

export function isValidEmail(value: string): string | undefined {
	return /\S+@\S+\.\S+/.test(value) ? undefined : "Invalid email address.";
}

export function isValidUsername(value: string): string | undefined {
	return value.startsWith("@") ? undefined : "Start your input with @";
}

export function isDecimalNumber(value: string): string | undefined {
	return value.match(/[^\d^.]/) ? "Should be a number" : undefined;
}
