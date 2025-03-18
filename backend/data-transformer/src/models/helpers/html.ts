import { DOMParser, HTMLElement } from "linkedom";

export function traverseUntilSameHeader(
    header: HTMLElement,
    action: (header: HTMLElement, node: Element | null) => void,
) {
    const headerLevel = parseInt(header.tagName[1]);

    let nextSibling = header.nextElementSibling;

    while (nextSibling) {
        // console.log(nextSibling);
        if (
            nextSibling.tagName[0] === "H" &&
            parseInt(nextSibling.tagName[1]) >= headerLevel
        ) {
            break;
        }
        let next = nextSibling.nextElementSibling;
        action(header, next);
        nextSibling = next;
    }
}
