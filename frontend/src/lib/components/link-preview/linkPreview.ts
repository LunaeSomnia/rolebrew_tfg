import { offset, flip, shift } from "svelte-floating-ui/dom";
import { createFloatingActions } from "svelte-floating-ui";

export const SHOW_TIME_OFFSET = 500;
export const HIDE_TIME_OFFSET = 200;

export function createLinkPreviewActions() {
    return createFloatingActions({
        strategy: "absolute",
        placement: "bottom",
        middleware: [offset(8), flip(), shift()],
    });
}
