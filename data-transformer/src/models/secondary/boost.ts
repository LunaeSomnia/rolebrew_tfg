type BoostOrFlawType = "grant" | "choose" | "free";

export function parseBoost(v: any) {
    if (v.value.value.length === 0) {
        return undefined;
    } else if (v.value.value.length === 1) {
        return {
            type: "grant",
            boost: v.value.value[0] as string,
        } as Boost;
    } else if (v.value.value.length === 6) {
        return {
            type: "free",
        } as Boost;
    } else {
        return {
            type: "choose",
            boosts: v.value.value,
        } as Boost;
    }
}

export class Boost {
    type!: BoostOrFlawType;
    boosts?: string[] | string;
}

export class Flaw {
    type!: BoostOrFlawType;
    flaws?: string[] | string;
}
