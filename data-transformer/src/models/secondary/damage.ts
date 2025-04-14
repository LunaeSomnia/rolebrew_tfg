export class DamageRoll {
    damageType?: string;
    dice?: number;
    die?: string;
    formula?: string;
    kind?: 'damage' | 'healing';
    type?: 'untyped' | 'fire' | 'electricity' | 'slashing' | 'void' | 'piercing' | 'cold' | 'poison' | 'bludgeoning'
    persistent?: {
        faces?: number;
        number: number;
        type: 'bleed' | 'poison' | 'fire' | 'acid'
    }
}

export class Damage {
    base!: DamageRoll
}