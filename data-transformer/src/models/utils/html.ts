import { HTMLElement, parseHTML } from "linkedom";
import { nameToSlug } from "../../utils/textTransform";
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
    html = transformLinks(html);
    return html
        .replaceAll("\n", "")
        .replaceAll("<hr>", "")
        .replaceAll(/<\/?hnan>/g, "");
}

const IGNORED_SECTIONS = [
    "journals",
    "heritages",
    "adventure-specific-actions",
    "other-effects",
    "action-macros",
    "spell-effects",
    "equipment-effects",
    "bestiary-effects",
    "lost-omens-tian-xia-world-guide",
    "pf2e-macros",
    "rollable-tables",
    "campaign-effects",
    "pathfinder-bestiary-3",
    "vehicles",
    "hazards",
];

const COMPENDIUM_SECTION_MATCHER: Map<string, string> = new Map([
    ["conditionitems", "condition"],
    ["classfeatures", "feat"],
    ["actionspf2e", "action"],
    ["feats-srd", "feat"],
    ["spells-srd", "spell"],
    ["ancestryfeatures", "ancestry"],
    ["feat-effects", "feat"],
    ["familiar-abilities", "familiar-abilities"],
    ["equipment-srd", "item"],
    ["deities", "deities"],
    ["bestiary-ability-glossary-srd", "bestiary"],
    ["pathfinder-monster-core", "bestiary"],
    ["pathfinder-bestiary-2", "bestiary"],
    ["pathfinder-bestiary", "bestiary"],
    ["book-of-the-dead-bestiary", "bestiary"],
    ["howl-of-the-wild-bestiary", "bestiary"],
    ["backgrounds", "background"],
]);

export const LINK_REGEX = /@UUID\[(.+?)\](\{(.+?)\})?/g;
export function transformLinks(text: string): string {
    const matches = text.matchAll(LINK_REGEX);
    for (const match of matches) {
        const wholeMatch = match[0];
        const uuid = match[1]
            .replaceAll("Compendium.pf2e.", "")
            .replaceAll(/\..+?\./g, ".")
            .replaceAll(".", "/");
        const uuidGroupId = match[2];
        const name = match[3];

        const uuidSplit = uuid.split("/");
        const uuidSection = uuidSplit[0];
        const uuidPageId = uuidSplit[1];

        if (!uuidGroupId || IGNORED_SECTIONS.indexOf(uuidSection) !== -1) {
            text = text.replaceAll(wholeMatch, "");
            continue;
        }

        const compendiumSectionMatched =
            COMPENDIUM_SECTION_MATCHER.get(uuidSection);
        if (!compendiumSectionMatched) {
            throw new Error("compendium section undefined: " + uuidSection);
        }

        const linkToReplace = `<a href="/compendium/${compendiumSectionMatched}/${nameToSlug(name)}">${name}</a>`;
        text = text.replaceAll(wholeMatch, linkToReplace);
    }
    return text;
}
