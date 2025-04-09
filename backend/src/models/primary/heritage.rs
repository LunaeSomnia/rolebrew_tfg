use crate::helpers::null_to_default;
use crate::models::{Publication, Rule, Summary, SummaryData};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Heritage {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub ancestry_slug: String,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    #[serde(rename = "type")]
    pub data_type: String,
}

impl Storeable for Heritage {
    fn table_name() -> &'static str {
        "heritage"
    }
}

impl From<Heritage> for Summary {
    fn from(value: Heritage) -> Self {
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
