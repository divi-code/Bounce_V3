import { useEffect, useState, RefObject } from "react";
import { callBatched } from "./use-batch";

const withIntersectionObserver = (cb: (observer: typeof IntersectionObserver) => void) => {
	if ("IntersectionObserver" in window) {
		Promise.resolve(IntersectionObserver).then(cb);
	} else {
		import("intersection-observer").then(() => withIntersectionObserver(cb));
	}
};

interface Options {
	once?: boolean;
	rootMargin?: string;
	threshold?: number[];
	rootRef?: RefObject<HTMLElement>;
	deps?: any[];
}

export const useIntersectionObserver = (callback, nodeRef, options: Options = {}) => {
	const [node, setNode] = useState(nodeRef?.current);

	useEffect(() => {
		if (node !== nodeRef?.current) {
			setNode(nodeRef?.current);
		}
	}, [nodeRef?.current]);

	useEffect(() => {
		let observer;
		let canceled = false;
		if (node) {
			withIntersectionObserver((Observer) => {
				if (canceled) {
					return;
				}
				observer = new Observer(
					(entries) => {
						entries.forEach(({ isIntersecting, intersectionRatio, target }) => {
							if (nodeRef.current === target) {
								callBatched(() => callback(isIntersecting, { ratio: intersectionRatio }));
							}
							if (isIntersecting && options.once) {
								observer.unobserve(node);
							}
						});
					},
					{
						rootMargin: options.rootMargin,
						root: options.rootRef ? options.rootRef.current : undefined,
						threshold: options.threshold,
					}
				);

				observer.observe(node);
			});
		}

		return () => {
			canceled = true;
			if (observer) {
				observer.disconnect();
			}
		};
	}, [node, options.rootMargin, ...(options.deps || [])]);
};

const percentageThreshold = (n: number) =>
	Array(n)
		.fill(1)
		.map((_, index, map) => index / map.length);

export const percentageThresholdLow = percentageThreshold(40);
export const percentageThresholdHigh = percentageThreshold(100);
export const percentageThresholdUltra = percentageThreshold(300);
