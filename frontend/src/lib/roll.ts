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