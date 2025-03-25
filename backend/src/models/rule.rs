use std::collections::BTreeMap;

use crate::helpers::{Either, MVec, null_to_default};
use serde::{Deserialize, Serialize};
use specta::Type;

use super::damage::{Damage, DamageRoll};

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(tag = "key", deny_unknown_fields)]
pub enum Rule {
    #[serde(rename_all = "camelCase")]
    ActiveEffectLike {
        mode: String,
        path: String,
        phase: Option<String>,
        value: serde_json::Value,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        priority: Option<u8>,
    },
    #[serde(rename_all = "camelCase")]
    Strike {
        fist: Option<bool>,

        damage: Option<Damage>,
        category: Option<String>,
        group: Option<String>,
        img: Option<String>,
        range: Option<serde_json::Value>,
        slug: Option<String>,
        label: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        traits: Vec<String>,
        base_type: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        options: Vec<String>,
    },
    #[serde(rename_all = "camelCase")]
    RollOption {
        count: Option<bool>,
        always_active: Option<bool>,
        mergeable: Option<bool>,
        disabled_value: Option<bool>,
        toggleable: Option<Either<String, bool>>,
        remove_upon_create: Option<bool>,

        label: Option<String>,
        option: String,
        phase: Option<String>,
        domain: Option<String>,
        placement: Option<String>,
        priority: Option<u8>,
        #[serde(default, deserialize_with = "null_to_default")]
        disabled_if: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        suboptions: Vec<RuleChoice>,
        #[serde(default, deserialize_with = "null_to_default")]
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    BaseSpeed {
        #[serde(rename = "type")]
        speed_type: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        selector: MVec<String>,
        value: serde_json::Value, // u8 originally
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    GrantItem {
        in_memory_only: Option<bool>,
        reevaluate_on_update: Option<bool>,
        allow_duplicate: Option<bool>,
        nest_feat: Option<bool>,

        preselect_coices: Option<serde_json::Value>, // lmao typo
        flag: Option<String>,
        uuid: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        preselect_choices: BTreeMap<String, String>,
        on_delete_actions: Option<serde_json::Value>, // Worth nothing
        alterations: Option<serde_json::Value>,       // TODO: Check
        priority: Option<u8>,
    },
    #[serde(rename_all = "camelCase")]
    ItemAlteration {
        item_id: Option<String>,
        item_type: Option<String>,
        phase: Option<String>,
        mode: String,
        label: Option<String>,
        selector: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        property: String,
        #[serde(default, deserialize_with = "null_to_default")]
        text_ref: Vec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        value: Option<serde_json::Value>,
        priority: Option<serde_json::Value>, // Worth nothing
    },
    #[serde(rename_all = "camelCase")]
    ChoiceSet {
        adjust_name: Option<bool>,
        actor_flag: Option<bool>,

        allowed_drops: Option<ChoiceSetAllowedDrops>,
        #[serde(default, deserialize_with = "null_to_default")]
        choices: MVec<Either<RuleChoice, String>>,
        roll_option: Option<String>,
        label: Option<String>,
        selection: Option<String>,
        flag: Option<String>,
        prompt: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        priority: Option<u8>,
    },
    #[serde(rename_all = "camelCase")]
    CreatureSize {
        resize_equipment: Option<bool>,

        value: String,
        reach: Option<serde_json::Value>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    FlatModifier {
        alternate: Option<bool>,
        critical: Option<bool>,
        hide_if_disabled: Option<bool>,
        from_equipment: Option<bool>,

        damage_category: Option<String>,
        damage_type: Option<String>,
        ability: Option<String>,
        label: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        slug: Option<String>,
        selector: MVec<String>,
        #[serde(rename = "type")]
        modifier_type: Option<String>,
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    AdjustDegreeOfSuccess {
        #[serde(default)]
        adjustment: BTreeMap<String, String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        selector: MVec<String>,
        #[serde(rename = "type")]
        selector_type: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        outcome: Vec<String>,
    },
    #[serde(rename_all = "camelCase")]
    Weakness {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(rename = "type", default, deserialize_with = "null_to_default")]
        weakness_type: MVec<String>,
        value: serde_json::Value,
    },
    #[serde(rename_all = "camelCase")]
    Immunity {
        #[serde(rename = "type")]
        immunity_type: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    AdjustStrike {
        mode: String,
        property: String,
        value: Either<String, u8>,
        #[serde(default, deserialize_with = "null_to_default")]
        definition: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        selector: Option<String>,
    },
    #[serde(rename_all = "camelCase")]
    Sense {
        selector: MVec<String>,
        range: Option<serde_json::Value>,
        acuity: Option<String>,
        value: Option<serde_json::Value>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    Resistance {
        value: serde_json::Value, // originally string
        #[serde(rename = "type")]
        #[serde(default, deserialize_with = "null_to_default")]
        resistance_type: MVec<String>,
        label: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        double_vs: Vec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        exceptions: Vec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        definition: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    DamageDice {
        hide_if_disabled: Option<bool>,
        critical: Option<bool>,

        slug: Option<String>,
        label: Option<String>,
        category: Option<String>,
        damage_type: Option<String>,
        dice_number: Option<Either<String, u8>>,
        die_size: Option<String>,
        #[serde(rename = "override")]
        #[serde(default)]
        override_damage: BTreeMap<String, serde_json::Value>,
        selector: MVec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    Note {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        selector: MVec<String>,
        text: String,
        title: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        outcome: Vec<String>,
    },
    #[serde(rename_all = "camelCase")]
    ActorTraits {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        add: Vec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        remove: Vec<String>,
    },
    #[serde(rename_all = "camelCase")]
    AdjustModifier {
        suppress: Option<bool>,

        max_applications: Option<u8>,
        #[serde(rename = "type")]
        adjust_type: Option<String>,
        damage_type: Option<String>,
        relabel: Option<String>,
        mode: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        selector: MVec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        selectors: Option<Vec<String>>,
        slug: Option<String>,
        value: Option<serde_json::Value>,
        priority: Option<u8>,
    },
    #[serde(rename_all = "camelCase")]
    TokenLight {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(skip_serializing)]
        value: serde_json::Value, // Worth nothing
    },
    #[serde(rename_all = "camelCase")]
    Aura {
        slug: Option<serde_json::Value>,      // Worth nothing
        effects: Option<serde_json::Value>,   // Worth nothing
        radius: Option<serde_json::Value>,    // Worth nothing
        traits: Option<serde_json::Value>,    // Worth nothing
        predicate: Option<serde_json::Value>, // Worth nothing
    },
    #[serde(rename_all = "camelCase")]
    CraftingEntry {
        is_daily_prep: Option<bool>,
        is_prepared: Option<bool>,
        is_alchemical: Option<bool>,

        max_item_level: Option<serde_json::Value>,
        label: Option<String>,
        max_slots: Option<u8>,
        name: Option<String>,
        selector: String,
        #[serde(default, deserialize_with = "null_to_default")]
        craftable_items: MVec<RulePredicateFilter>,
        batch_sizes: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    EphemeralEffect {
        affects: Option<String>,
        uuid: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        selectors: MVec<String>,
    },
    #[serde(rename_all = "camelCase")]
    DamageAlteration {
        mode: String,
        slug: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        property: String,
        #[serde(default, deserialize_with = "null_to_default")]
        selectors: Vec<String>,
        value: Option<serde_json::Value>,
        priority: Option<u8>,
    },
    #[serde(rename_all = "camelCase")]
    MartialProficiency {
        label: Option<String>,
        same_as: Option<String>,
        slug: Option<String>,
        max_rank: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        definition: MVec<RulePredicateFilter>,
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    CriticalSpecialization {
        alternate: Option<bool>,

        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        damage_dice: Option<DamageRoll>,
    },
    #[serde(rename_all = "camelCase")]
    SubstituteRoll {
        required: Option<bool>,

        selector: String,
        effect_type: Option<String>,
        label: Option<String>,
        slug: Option<String>,
        value: u8,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    MultipleAttackPenalty {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        selector: String,
        value: i8,
    },
    #[serde(rename_all = "camelCase")]
    RollTwice {
        remove_after_roll: Option<bool>,

        keep: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        selector: String,
    },
    #[serde(rename_all = "camelCase")]
    FastHealing {
        #[serde(rename = "type")]
        healing_type: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        value: u8,
    },
    #[serde(rename_all = "camelCase")]
    DexterityModifierCap {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        value: u8,
    },
    #[serde(rename_all = "camelCase")]
    TempHP {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        value: u8,
    },
    #[serde(rename_all = "camelCase")]
    SpecialStatistic {
        extends: String,
        item_casting: SpecialStatisticItemCasting,
        priority: Option<u8>,
        slug: String,
    },
    #[serde(rename_all = "camelCase")]
    TokenEffectIcon {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        value: String,
    },
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(untagged)]
pub enum RulePredicateFilter {
    String(String),
    Number(i8),
    Not {
        not: MVec<Box<RulePredicateFilter>>,
    },
    And {
        and: MVec<Box<RulePredicateFilter>>,
    },
    Or {
        or: MVec<Box<RulePredicateFilter>>,
    },
    Nand {
        nand: MVec<Box<RulePredicateFilter>>,
    },
    Nor {
        nor: MVec<Box<RulePredicateFilter>>,
    },
    Lt {
        lt: MVec<Box<RulePredicateFilter>>,
    },
    Lte {
        lte: MVec<Box<RulePredicateFilter>>,
    },
    Gt {
        gt: MVec<Box<RulePredicateFilter>>,
    },
    Gte {
        gte: MVec<Box<RulePredicateFilter>>,
    },
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct RuleChoice {
    label: Option<String>,
    item_type: Option<String>,
    value: Option<serde_json::Value>,
    #[serde(default, deserialize_with = "null_to_default")]
    filter: MVec<RulePredicateFilter>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct ChoiceSetAllowedDrops {
    label: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    predicate: MVec<RulePredicateFilter>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct SpecialStatisticItemCasting {
    #[serde(default, deserialize_with = "null_to_default")]
    predicate: MVec<RulePredicateFilter>,
}
