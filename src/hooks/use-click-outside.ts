import { useEffect, RefObject, useRef } from "react";

const nothing = () => null;

export const useOnClickOutside = (
	refs: Array<RefObject<HTMLElement>>,
	handler: (event: Event) => any,
	enabled: boolean
) => {
	const handlerRef = useRef(handler);

	if (!enabled) {
		handlerRef.current = nothing;
	}

	useEffect(() => {
		handlerRef.current = enabled ? handler : nothing;
	});

	useEffect(
		() => {
			const listener = (event: Event) => {
				// if you are disabled - bail out
				if (handlerRef.current === nothing) {
					return;
				}

				// Do nothing if clicking ref's element or descendent elements
				if (refs.some((ref) => !ref.current || ref.current.contains(event.target as any))) {
					return;
				}

				// defer event to hide it from react
				setTimeout(() => {
					handlerRef.current(event);
				}, 16);
			};

			document.addEventListener("mousedown", listener);
			document.addEventListener("touchstart", listener);
			document.addEventListener("focusin", listener);

			return () => {
				document.removeEventListener("mousedown", listener);
				document.removeEventListener("touchstart", listener);
				document.removeEventListener("focusin", listener);
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[...refs]
	);
};
