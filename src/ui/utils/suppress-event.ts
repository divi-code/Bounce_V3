export const suppressEvent = (e: { stopPropagation(): void }) => {
	e.stopPropagation();
};
