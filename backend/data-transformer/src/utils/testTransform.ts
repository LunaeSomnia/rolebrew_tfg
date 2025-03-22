export function nameToSlug(name: string): string {
    return name
        .toLowerCase()
        .replaceAll(/[\(\)\'\.]/g, "")
        .replaceAll(" ", "-");
}
