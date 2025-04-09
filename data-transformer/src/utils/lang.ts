const actionEn = await Bun.file('lang/action-en.json').json();
const en = await Bun.file('lang/en.json').json();
const kingmakerEn = await Bun.file('lang/kingmaker-en.json').json();
const reEn = await Bun.file('lang/re-en.json').json();

export function searchInLangFile(str: string, file: any): string | undefined {
    const split = str.split('.')
    let obj = file;
    for (let i = 0; i < split.length; i++) {
        try {
            obj = obj[split[i]]
        } catch (error) {
            return undefined
        }
    }
    if (obj) {
        return obj as string
    }
    return undefined;
}

export function possiblyTranslate(str: string) {

    if (!str.includes('.')) {
        return str
    }

    const actionEnValue = searchInLangFile(str, actionEn)
    if (actionEnValue) {
        return actionEnValue
    }

    const enValue = searchInLangFile(str, en)
    if (enValue) {
        return enValue
    }

    const kingmakerEnValue = searchInLangFile(str, kingmakerEn)
    if (kingmakerEnValue) {
        return kingmakerEnValue
    }

    const reEnValue = searchInLangFile(str, reEn)
    if (reEnValue) {
        return reEnValue
    }

    return str
}