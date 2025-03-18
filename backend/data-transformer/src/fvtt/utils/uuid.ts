export type TypeLink = {
    type: string;
    uuid: string;
    text: string;
};

export function extractTypeLinkFromText(text: string): TypeLink[] {
    const links: TypeLink[] = [];
    for (const c of text.matchAll(/@(.+?)\[(.+?)\](\{(.+?)\})?/g)) {
        const type = c[1];
        const uuid = c[2];
        const text = c[3];
        links.push({
            type,
            uuid,
            text,
        });
    }
    return links;
}

export function extractLastUuid(uuid: string): string {
    const lastIndexOfDot = uuid.lastIndexOf(".");
    return uuid.substring(lastIndexOfDot + 1);
}
