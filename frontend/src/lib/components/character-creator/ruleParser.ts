import type { Either, Rule, RuleChoice, Attribute } from "$lib/bindings";
import type { Choice, DecisionTree } from "./characterCreator.svelte";

export const ATTRIBUTE_VALUES = [
    "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"
]

export const FETCHABLE_TYPES = [
    'heritage', 'feat', 'ancestry', 'trait'
]

const CLEANUP_TITLE_REGEX = /Select an? /g
function cleanupDecisionTitle(title: string) {
    title = title.replaceAll(CLEANUP_TITLE_REGEX, "")
    title = title[0].toUpperCase() + title.slice(1)
    return title
}

export async function parseChoiceSet(rule: Rule, name: string = "", slug: string = "") {
    if (rule.key !== 'ChoiceSet') {
        throw new Error(`rule '${rule.key}' can't be parsed. reason: wasn't a 'ChoiceSet'`)
    }

    let decision = {
        label: cleanupDecisionTitle((rule.label ?? name).replace('.', "")),
        slug: (rule.slug ?? slug).replace('.', ""),
        choices: []
    } as DecisionTree

    if (rule.flag === 'skill') {
        decision.choices = ATTRIBUTE_VALUES.map(v => {
            return {
                label: v,
                value: v.toLowerCase(),
                compendiumType: 'skill',
                subDecisions: []
            } as Choice
        })
    }


    if (rule.choices) {
        let choiceType = rule.flag ?? ""

        type FetchDataType = {
            type: string,
            document: Object,
            data: any | null
        }
        const toFetchData: FetchDataType[] = []

        for (const choice of rule.choices) {
            if (typeof choice !== 'string') {
                choiceType = choice.item_type ?? 'feat'
                let rulechoice = {
                    label: (choice.label ?? '').replace('.', ""),
                    value: (choice.value as string ?? '').replace('.', ""),
                    compendiumType: choiceType,
                    subDecisions: []
                } as Choice

                decision.choices.push(rulechoice)

                if (choice.filter !== undefined && choice.filter.length > 0) {

                    let documentQuery: Record<string, any> = {}

                    for (const filter of choice.filter ?? []) {
                        if (typeof filter === 'string') {
                            parseFilter(documentQuery, choiceType, filter);
                        }
                    }

                    toFetchData.push({
                        type: choiceType,
                        document: documentQuery,
                        data: null
                    })
                }
            }
        }

        const data = await Promise.all(toFetchData.map(async (v: FetchDataType) => {
            const v_1 = await fetch(`/api/${choiceType}/filtered`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(v.document)
            });
            const json = await v_1.json();
            v.data = json;
            return v;
        }))

        data.forEach(choices => {
            const choicesMapped = choices.data.map((v: any) => {
                return {
                    label: v.name,
                    value: v.slug,
                    compendiumType: v.type,
                    subDecisions: []
                } as Choice
            })

            if (choicesMapped.length !== 0) {
                decision.choices = decision.choices.concat(choicesMapped)
            }

        })
    }




    return decision
}

const ATTRIBUTE_MAPPING: Record<string, string> = {
    'trait': 'traits',
    'tag': 'tags'
}

export function parseFilter(documentQuery: Record<string, any>, filterType: string, filter: string) {

    switch (filterType) {
        case 'feat':
            if (filter.startsWith('item:')) {
                const item = filter.replace('item:', "")
                let [left, right] = item.split(':')

                const mapped = Object.entries(ATTRIBUTE_MAPPING).find(v => v[0] === left)
                if (mapped) {
                    left = mapped[1];
                }

                documentQuery[left] = right
                const possibleNumber = Number.parseInt(right);
                if (possibleNumber) {
                    documentQuery[left] = possibleNumber
                }
            }
            break

    }
}