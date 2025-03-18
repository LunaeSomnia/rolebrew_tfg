import "reflect-metadata";
import "es6-shim";

import { Exclude, Expose, Transform, Type } from "class-transformer";
import { CompendiumFile } from "../helpers/compendium.ts";
import { Item } from "../secondary/item.ts";
import type { Publication } from "../secondary/publication.ts";
import type { Boost, Flaw } from "../secondary/boost.ts";
import { mapToRule, type RuleType } from "../secondary/rule.ts";
import type { EntryData } from "../../pf2e/utils/referencedPage.ts";
import { PF2ETOOLS_ANCESTRIES } from "../../pf2e/pf2etools.ts";

export class Ancestry {
    // fvtt
    fvttId!: string;
    name!: string;
    additionalLanguages!: {
        count: number;
        custom: string;
        value: string[];
    };
    boosts!: Record<string, Boost>;
    flaws!: Record<string, Flaw>;
    hp!: number;
    reach!: number;
    rules!: any[];
    size!: string;
    rarity!: string;
    traits!: string[];
    vision!: string;
    slug!: string;
    @Exclude() items!: any;

    // pf2etools
    speed!: {
        walk: number;
    };
    languages!: string[];

    @Expose({ name: "items" })
    features!: AncestryFeature[];
    heritage!: any[];
    description!: {
        flavor: EntryData;
        info: EntryData;
        heritageInfo: EntryData;
    };
    summary!: string;
    img!: string[];

    //
    @Transform(({ obj }) => {
        return {
            remaster: obj.publication.remaster,
            license: obj.publication.license,
            title: obj.publication.title,
            source: obj.source,
            page: obj.page,
        } as Publication;
    })
    publication!: Publication;
}

export class AncestryFeature {
    // fvtt
    fvttId!: string;
    name!: string;

    @Transform(({ obj }) => obj.system.actionType.value)
    @Expose()
    actionType!: string;

    @Transform(({ obj }) => {
        const pf2etoolsAncestry = PF2ETOOLS_ANCESTRIES.get(obj.name);
        if (!pf2etoolsAncestry) {
            throw new Error(
                `assert failed: ancestry feature '${obj.name}' of ancestry not found in pf2etools`,
            );
        }
    })
    @Expose()
    description!: EntryData;

    @Transform(({ obj }) => obj.system.publication as Publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: RuleType[];

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => obj.system.traits.selected)
    @Expose()
    selectedTraits!: any;

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Exclude() level!: number;
    @Exclude() actions!: { value: null };
    @Exclude() img!: string;
    @Exclude() system?: null;
    @Exclude() _migration?: null;
}

export class AncestryHeritage extends CompendiumFile {
    @Transform(({ obj }) => {
        if (obj.system.ancestry) return obj.system.ancestry.slug;
        return "";
    })
    @Expose()
    ancestrySlug!: string;

    @Transform(({ obj }) => {
        return obj.system.description.value;
    })
    @Expose()
    description!: string;

    @Transform(({ obj }) => {
        return obj.system.publication;
    })
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: RuleType[];

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Exclude() folder?: null;

    @Exclude() ancestry?: null;

    @Exclude() system?: null;
}
