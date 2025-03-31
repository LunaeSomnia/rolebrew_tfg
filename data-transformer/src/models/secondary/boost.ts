type BoostOrFlawType = "grant" | "choose" | "free";

export class Boost {
    type!: BoostOrFlawType;
    boosts?: string[] | string;
}

export class Flaw {
    type!: BoostOrFlawType;
    flaws?: string[] | string;
}
