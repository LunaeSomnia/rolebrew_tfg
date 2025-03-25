use crate::helpers::null_to_default;
use crate::models::{publication::Publication, rule::Rule};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
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
}

impl Storeable for Action {
    fn table_name() -> &'static str {
        "action"
    }
}
