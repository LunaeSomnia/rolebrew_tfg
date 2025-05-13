use super::{RuleChoice, RulePredicateFilter};
use crate::helpers::{Either, MVec, null_to_default};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ChoiceSetRule {
    pub adjust_name: Option<Either<bool, String>>, // Whether to edit the name of the original item to include the selection made
    pub slugs_as_values: Option<bool>,
    pub actor_flag: Option<bool>,

    pub allowed_drops: Option<ChoiceSetAllowedDrops>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub choices: MVec<Either<RuleChoice, String>>,
    pub roll_option: Option<String>, // Adds a prefix to the 'Choice'
    pub label: Option<String>,
    pub selection: Option<String>,
    pub flag: Option<String>, // Sets the flag's name for the ruleSections data path
    pub slug: Option<String>,
    pub prompt: Option<String>, // Heading on the prompt
    #[serde(default, deserialize_with = "null_to_default")]
    pub predicate: MVec<RulePredicateFilter>,
    pub priority: Option<i16>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct ChoiceSetAllowedDrops {
    pub label: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub predicate: MVec<RulePredicateFilter>,
}
