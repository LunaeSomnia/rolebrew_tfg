export type LinkText = {
    type: string,
    uuid: string,
    text: string,
}

export function linkExtractor(text: string): LinkText[] {
    const links: LinkText[] = []
    for (const c of text.matchAll(/@(.+?)\[(.+?)\]\{(.+?)\}/g)) {
        const type = c[1]
        const uuid = c[2]
        const text = c[3]
        links.push({
            type,
            uuid,
            text,
        })
    }
    return links
}

export type DescriptionExtraction = {
    description: string,
    links?: LinkText[],
    source?: LinkText,
}

export function descritionExtractor(description: string): DescriptionExtraction {
    description = description.replaceAll(/\<(.+?)\/?\>/g, "")
    let links = linkExtractor(description);
    let source;
    if (links.length > 0) {
        source = links.pop();
    }

    // if (source)
    //     description = description.replaceAll(textLinkCreator(source), "")
    return {
        description,
        source,
        links
    }
}

//

export function textLinkCreator(linkText: LinkText): string {
    return `@${linkText.type}[${linkText.uuid}]{${linkText.text}}`
}