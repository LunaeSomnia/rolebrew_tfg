import type { DamageRoll } from "./bindings";

export function roll(max: number) {
    const roll = Math.floor(Math.random() * max) + 1;
    return roll;
}

export function calculateDamageRoll(damage: DamageRoll): number[] {
    let rolled = [];
    for (let i = 0; i < (damage.dice ?? 0); i++) {
        let faces = 0;
        if (typeof damage.die === "number") {
            faces = damage.die;
        } else if (damage.die) {
            faces = Number.parseInt(damage.die[1]);
        }
        rolled.push(roll(faces));
    }

    return rolled;
}

const DICE_REGEX = /(\d+)d(\d+)/
export type RollFromFormulaResult = {
    times: number,
    faces: number,
    values: number[],
    total: number,
}
export function rollFromFormula(str: string): RollFromFormulaResult {
    str = str.replaceAll(" ", "")
    const match = str.match(DICE_REGEX);
    if (match) {
        const group = match[0]
        const times = Number.parseInt(match[1])
        const faces = Number.parseInt(match[2])

        let rolls = [];
        for (let i = 0; i < times; i++) {
            rolls.push(roll(faces))
        }
        str = str.replace(group, rolls.reduce((t, v) => t += v, 0).toString())
        return {
            times,
            faces,
            values: rolls,
            total: eval(str)
        }
    }
    return {
        times: 0,
        faces: 0,
        values: [],
        total: eval(str)
    }

}