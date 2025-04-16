use crate::helpers::null_to_default;
use crate::models::{LinkPreview, Summary, SummaryData};
use crate::models::{publication::Publication, rule::Rule};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Action {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,
    pub action_type: Option<String>,
    pub actions: Option<u8>,
    pub category: Option<String>,
    pub description: String,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub rarity: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub slug: String,
    #[serde(rename = "type")]
    pub data_type: String,
}

impl Storeable for Action {
    fn table_name() -> &'static str {
        "action"
    }
}

impl From<Action> for Summary {
    fn from(value: Action) -> Self {
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

impl From<Action> for LinkPreview {
    fn from(value: Action) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: value.rarity,
            traits: value.traits,
        }
    }
}
