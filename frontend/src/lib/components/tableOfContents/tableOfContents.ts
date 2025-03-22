export type TOCNode = {
    level: number;
    text: string;
    id: string;
    top: number;
    children: TOCNode[];
};

export function buildTOCTree(headers: NodeListOf<Element>, target: Element): TOCNode {
    const offsetTop = parseFloat(window.getComputedStyle(document.body).fontSize.replaceAll("px", "")) * 8;
    const tree: TOCNode = {
        level: 0,
        text: "root",
        id: "root",
        children: [],
        top: 0
    };
    let headerArr: TOCNode[] = [tree];
    let lastSeenHeaderLevel = 0

    headers.forEach((header) => {
        const level = parseInt(header.tagName[1]); // h1 -> 1, h2 -> 2, etc.
        const headerObj: TOCNode = {
            level: level,
            text: header.textContent || "",
            id:
                header.id ||
                header.textContent?.replace(/\s+/g, "-").toLowerCase() ||
                "",
            children: [],
            top: (header as HTMLElement).offsetTop - offsetTop
        };


        if (level >= lastSeenHeaderLevel) {
            // new header is a child of some upper element or sibling of the last. we search for the parent
            let difference = 1;
            while (headerArr[level - difference] === undefined && level - difference > 0) {
                difference++;
            }
            // we add the child to that element
            headerArr[level - difference].children.push(headerObj)
        } else if (level < lastSeenHeaderLevel) {
            // new header is a sibling of some parent in the tree. we search for the parent
            let difference = 1;
            while (headerArr[level - difference] === undefined && level - difference > 0) {
                difference++;
            }
            let idx = headerArr.length;
            while (idx !== level - difference + 1) {
                headerArr.pop();
                idx--
            }
            headerArr[level - difference].children.push(headerObj)
        }
        headerArr[level] = headerObj
        lastSeenHeaderLevel = level
    });

    return tree;
}

export function treeToArrayTOC(toc: TOCNode): TOCNode[] {
    let array = []
    let toCheck = [toc]
    while (toCheck.length > 0) {
        const next = toCheck.pop();
        if (next) {
            array.push(next)
            toCheck.push(...next?.children)
        } else {
            break;
        }
    }
    array = array.toSorted((a, b) => a.top - b.top)
    return array
}