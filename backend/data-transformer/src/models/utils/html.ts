import { HTMLElement, parseHTML } from "linkedom";
import { nameToSlug } from "../../utils/testTransform";
import * as parse5 from "parse5";
import { defaultTreeAdapter } from "parse5";

export function extractUntilHeader(html: string) {
    const document = parse5.parseFragment(html, {
        treeAdapter: defaultTreeAdapter,
    });

    let resultNodes = [];

    for (let i = 0; i < document.childNodes.length; i++) {
        let node = document.childNodes[i];

        if (!node.nodeName.match(/^h[1-6]$/)) {
            resultNodes.push(node);
        } else {
            break;
        }
    }

    document.childNodes = resultNodes;
    return parse5.serialize(document);
}

export function extractHeaderSection(
    html: string,
    headerSectionMatch: RegExp | string,
) {
    const document = parse5.parseFragment(html, {
        treeAdapter: defaultTreeAdapter,
    });

    let insideTargetSection = false;
    let resultNodes = [];

    for (let i = 0; i < document.childNodes.length; i++) {
        let node = document.childNodes[i];

        if (node.nodeName.match(/^h[1-6]$/)) {
            // @ts-ignore
            const text = node.childNodes.find(
                (v: any) => v.nodeName === "#text",
            );
            if (text && text.value.toLowerCase().match(headerSectionMatch)) {
                insideTargetSection = true;
                resultNodes.push(node);
                continue;
            }

            if (insideTargetSection && parseInt(node.nodeName[1]) <= 2) {
                insideTargetSection = false;
            }
        }

        if (insideTargetSection) {
            resultNodes.push(node);
        }
    }

    document.childNodes = resultNodes;
    return parse5.serialize(document);
}

export function stepHeaders(html: string) {
    const document = parse5.parseFragment(html, {
        treeAdapter: defaultTreeAdapter,
    });

    for (let i = 0; i < document.childNodes.length; i++) {
        let node = document.childNodes[i];

        if (node.nodeName[0] === "h") {
            const nodeHeaderSize = Number.parseInt(node.nodeName[1]);
            node.nodeName = `h${nodeHeaderSize + 1}`;
            // @ts-ignore
            node.tagName = `h${nodeHeaderSize + 1}`;
        }
    }

    return parse5.serialize(document);
}

export function assignHeaderIds(html: string) {
    const document = parse5.parseFragment(html, {
        treeAdapter: defaultTreeAdapter,
    });

    for (let i = 0; i < document.childNodes.length; i++) {
        let node = document.childNodes[i];

        if (node.nodeName[0] === "h") {
            // @ts-ignore
            const text = node.childNodes.find(
                (v: any) => v.nodeName === "#text",
            );
            if (text) {
                const nodeId = nameToSlug(text.value);
                // @ts-ignore
                if (!node.attrs) {
                    // @ts-ignore
                    node.attrs = [];
                }
                // @ts-ignore
                const idAttribute = node.attrs.find(
                    (attr: any) => attr.name === "id",
                );
                if (!idAttribute) {
                    // @ts-ignore
                    node.attrs.push({ name: "id", value: nodeId });
                }
            }
        }
    }

    return parse5.serialize(document);
}

export function cleanupHTML(html: string) {
    return html.replaceAll("<hr>", "").replaceAll(/<\/?hnan>/g, "");
}
