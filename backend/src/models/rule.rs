use std::collections::BTreeMap;

use crate::helpers::{MVec, null_to_default};
use serde::{Deserialize, Serialize};
use specta::Type;

use super::damage::Damage;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(tag = "key", deny_unknown_fields)]
pub enum Rule {
    #[serde(rename_all = "camelCase")]
    ActiveEffectLike {
        mode: String,
        path: String,
        value: serde_json::Value,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
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
    },
    #[serde(rename_all = "camelCase")]
    RollOption {
        always_active: Option<bool>,
        mergeable: Option<bool>,
        toggleable: Option<bool>,
        remove_upon_create: Option<bool>,

        label: Option<String>,
        option: String,
        domain: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        suboptions: Vec<RuleChoice>,
        #[serde(default, deserialize_with = "null_to_default")]
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    BaseSpeed {
        selector: MVec<String>,
        value: u8,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    GrantItem {
        reevaluate_on_update: Option<bool>,
        allow_duplicate: Option<bool>,
        nest_feat: Option<bool>,

        uuid: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        #[serde(default, deserialize_with = "null_to_default")]
        preselect_choices: BTreeMap<String, String>,
    },
    #[serde(rename_all = "camelCase")]
    ItemAlteration {
        item_id: Option<String>,
        item_type: Option<String>,
        mode: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        property: String,
        #[serde(default, deserialize_with = "null_to_default")]
        text_ref: Vec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    ChoiceSet {
        adjust_name: Option<bool>,
        actor_flag: Option<bool>,

        allowed_drops: Option<ChoiceSetAllowedDrops>,
        #[serde(default, deserialize_with = "null_to_default")]
        choices: MVec<RuleChoice>,
        roll_option: Option<String>,
        label: Option<String>,
        flag: Option<String>,
        prompt: Option<String>,
    },
    #[serde(rename_all = "camelCase")]
    CreatureSize { value: String },
    #[serde(rename_all = "camelCase")]
    FlatModifier {
        hide_if_disabled: Option<bool>,

        label: Option<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        slug: Option<String>,
        selector: MVec<String>,
        #[serde(rename = "type")]
        modifier_type: Option<String>,
        value: serde_json::Value,
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
        #[serde(rename = "type")]
        weakness_type: String,
        value: String,
    },
    #[serde(rename_all = "camelCase")]
    Immunity {
        #[serde(rename = "type")]
        immunity_type: String,
    },
    #[serde(rename_all = "camelCase")]
    AdjustStrike {
        mode: String,
        property: String,
        value: String,
        #[serde(default, deserialize_with = "null_to_default")]
        definition: Vec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    Sense {
        selector: MVec<String>,
        range: Option<serde_json::Value>,
        acuity: Option<String>,
        value: Option<serde_json::Value>,
    },
    #[serde(rename_all = "camelCase")]
    Resistance {
        value: String,
        #[serde(rename = "type")]
        resistance_type: String,
    },
    #[serde(rename_all = "camelCase")]
    DamageDice {
        #[serde(rename = "override")]
        #[serde(default)]
        override_damage: BTreeMap<String, serde_json::Value>,
        selector: MVec<String>,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
    },
    #[serde(rename_all = "camelCase")]
    Note {
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        selector: MVec<String>,
        text: String,
        title: String,
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

        mode: String,
        #[serde(default, deserialize_with = "null_to_default")]
        predicate: MVec<RulePredicateFilter>,
        selector: MVec<String>,
        slug: String,
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
        effects: serde_json::Value, // Worth nothing
        radius: serde_json::Value,  // Worth nothing
        traits: serde_json::Value,  // Worth nothing
    },
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(untagged)]
pub enum RulePredicateFilter {
    String(String),
    Number(u8),
    And { and: MVec<Box<RulePredicateFilter>> },
    Not { not: MVec<Box<RulePredicateFilter>> },
    Nor { nor: MVec<Box<RulePredicateFilter>> },
    Lte { lte: MVec<Box<RulePredicateFilter>> },
    Or { or: MVec<Box<RulePredicateFilter>> },
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct RuleChoice {
    label: Option<String>,
    value: serde_json::Value,
    #[serde(default, deserialize_with = "null_to_default")]
    filter: MVec<RulePredicateFilter>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct ChoiceSetAllowedDrops {
    label: String,
    predicate: Vec<String>,
}
