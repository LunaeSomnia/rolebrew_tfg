import type { Attribute } from "$lib/bindings"
import { roll } from "$lib/roll"

export enum AbilityScoreMethod {
    Standard = "Standard",
    Classic = "Classic",
    Heroic = "Heroic",
    DicePool = "Dice Pool",
}

export type RollResult = {
    total: number,
    rolls: Roll[]
}

export type Roll = {
    value: number,
    dice: number,
    excluded: boolean,
}


function rollAbilityScore(rollPerAbilityScore: number): number[] {
    let finalArray = []
    for (let i = 0; i < rollPerAbilityScore; i++) {
        finalArray.push(roll(6))
    }
    return finalArray
}

export function rollAbilityScores(method: AbilityScoreMethod, rollCount: number = 6): RollResult[] {
    let rolls = new Array(rollCount)

    switch (method) {
        case AbilityScoreMethod.Standard:

            const assignStandardMethod = () => {
                const rolledScores = rollAbilityScore(4);
                const rolledScoresMapped = rolledScores.map(v => {
                    return {
                        value: v,
                        dice: 6,
                        excluded: false
                    } as Roll
                })
                const minValue = Math.min(...rolledScores)
                const minRolledIdx = rolledScoresMapped.findIndex(v => v.value === minValue);
                const minRolled = rolledScoresMapped[minRolledIdx]
                const rollsWithoutMin = rolledScoresMapped.filter((v, i) => i !== minRolledIdx)
                if (minRolled)
                    minRolled.excluded = true
                console.log(rolledScoresMapped)
                return {
                    total: rollsWithoutMin.reduce((t, v) => t += v.value, 0),
                    rolls: rolledScoresMapped
                } as RollResult
            }

            rolls[0] = assignStandardMethod()
            rolls[1] = assignStandardMethod()
            rolls[2] = assignStandardMethod()
            rolls[3] = assignStandardMethod()
            rolls[4] = assignStandardMethod()
            rolls[5] = assignStandardMethod()
            break;
    }

    return rolls;
}