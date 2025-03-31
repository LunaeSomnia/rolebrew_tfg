import { PUBLIC_BACKEND_URL } from "$env/static/public";

const IGNORED_SECTIONS = ["journals"];

const COMPENDIUM_SECTION_MATCHER: Map<string, string> = new Map([
    ["conditionitems", "condition"],
    ["actionspf2e", "action"],
    ["feats-srd", "feat"],
    ["spells-srd", "spell"],
    ["ancestryfeatures", "ancestry"],
    ["feat-effects", "feat"],
]);

export function stringToSlug(string: string): string {
    return string.toLowerCase().replaceAll(" ", "-");
}

export const UUID_LINK_REGEX = /@UUID\[(.+?)\](\{(.+?)\})?/g;
export function transformLinks(text: string): string {
    const matches = text.matchAll(UUID_LINK_REGEX);
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

        const linkToReplace = `<a href="/compendium/${compendiumSectionMatched}/${stringToSlug(name)}">${name}</a>`;
        text = text.replaceAll(wholeMatch, linkToReplace);
    }
    return text;
}

export const EMPTY_HTML_ELEMENT = /<([^\/>]+?)><\/(.+?)>/g;
export function transformDescription(text: string): string {
    text = transformLinks(text);

    // remove empty html elements
    while (text.match(EMPTY_HTML_ELEMENT) !== null) {
        const matches = text.matchAll(EMPTY_HTML_ELEMENT);
        for (const match of matches) {
            const wholeMatch = match[0];
            const firstGroup = match[1];
            const secondGroup = match[2];

            if (firstGroup !== secondGroup) {
                console.error(text);
                throw new Error(
                    `empty html element found, but types didnt match: ${firstGroup}, ${secondGroup}`,
                );
            }

            text = text.replaceAll(wholeMatch, "");
        }
    }

    return text.trim();
}

const COMPENDIUM_SOURCE_ABBREVIATIONS: Map<string, string> = new Map([
    ["Player Core", "CRB"],
    ["Player Core 2", "CRB2"],
    ["Book of the Dead", "BD"],
    ["Lost Omens: Ancestry Guide", "LOAG"],
    ["Lost Omens: Impossible Lands", "LOIL"],
    ["Lost Omens: The Mwangi Expanse", "LOME"],
    ["Lost Omens: Absalom, City of Lost Omens", "ACLO"],
    ["Lost Omens: The Grand Bazaar", "LOGB"],
    ["Lost Omens: Tian Xia Character Guide", "TXCG"],
    ["Howl of the Wild", "HotW"],
    ["Guns & Gears", "G&G"],
    ["#153: Life's Long Shadows", "LLS"],
]);
export function abbreviateSource(source: string): string {
    const sourceTrimmed = source.replace("Pathfinder ", "").trim();
    return (
        COMPENDIUM_SOURCE_ABBREVIATIONS.get(
            sourceTrimmed.replace("Pathfinder ", ""),
        ) ?? sourceTrimmed
    );
}

export const LINK_REGEX = /<a href="([^\"]+?)">([^\<]+?)<\/a>/g;
export function linkToLinkPreviewConverter(html: string) {
    const matches = html.matchAll(LINK_REGEX).toArray();

    for (const match of matches) {
        const wholeMatch = match[0];
        const href = match[1];
        const text = match[2];

        html = html.replaceAll(
            wholeMatch,
            `<link-preview href="${href}" text="${text}">${text}</link-preview>`,
        );
    }
    return html;
}

export function hrefToSummaryHref(href: string): string {
    return (
        PUBLIC_BACKEND_URL +
        href.replaceAll("compendium", "api").replaceAll(/#.+?[$\/]/g, "") +
        "/preview"
    );
}
