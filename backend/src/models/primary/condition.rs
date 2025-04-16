use crate::helpers::null_to_default;
use crate::models::{LinkPreview, Publication, Rule, Summary, SummaryData};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Condition {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,

    pub group: Option<String>,
    pub description: String,
    pub duration: ConditionDuration,
    #[serde(default, deserialize_with = "null_to_default")]
    pub overrides: Vec<String>,
    pub publication: Publication,
    pub removable: Option<bool>,
    pub rules: Vec<Rule>,
    pub slug: String,
    pub value: Option<u8>,
    #[serde(rename = "type")]
    pub data_type: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ConditionDuration {
    pub expiry: Option<bool>,
    pub perpetual: Option<bool>,
    pub text: Option<String>,
    pub unit: String,
    pub value: i8,
}

impl Storeable for Condition {
    fn table_name() -> &'static str {
        "condition"
    }
}

impl From<Condition> for Summary {
    fn from(value: Condition) -> Self {
        let data = vec![SummaryData::String {
            value: value.name.clone(),
            link: None,
            tooltip: None,
            abbreviation: None,
        }];

        Self {
            id: value.fvtt_id,
            name: value.name,
            slug: value.slug,
            data,
        }
    }
}

impl From<Condition> for LinkPreview {
    fn from(value: Condition) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: None,
            traits: Vec::new(),
        }
    }
}
