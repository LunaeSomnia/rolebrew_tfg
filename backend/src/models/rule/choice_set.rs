use super::{RuleChoice, RulePredicateFilter};
use crate::helpers::{Either, MVec, null_to_default};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ChoiceSetRule {
    adjust_name: Option<Either<bool, String>>, // Whether to edit the name of the original item to include the selection made
    slugs_as_values: Option<bool>,
    actor_flag: Option<bool>,

    allowed_drops: Option<ChoiceSetAllowedDrops>,
    #[serde(default, deserialize_with = "null_to_default")]
    choices: MVec<Either<RuleChoice, String>>,
    roll_option: Option<String>, // Adds a prefix to the 'Choice'
    label: Option<String>,
    selection: Option<String>,
    flag: Option<String>, // Sets the flag's name for the ruleSections data path
    slug: Option<String>,
    prompt: Option<String>, // Heading on the prompt
    #[serde(default, deserialize_with = "null_to_default")]
    predicate: MVec<RulePredicateFilter>,
    priority: Option<i16>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct ChoiceSetAllowedDrops {
    label: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    predicate: MVec<RulePredicateFilter>,
}
