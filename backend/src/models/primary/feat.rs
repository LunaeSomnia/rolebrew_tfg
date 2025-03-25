use crate::{
    helpers::null_to_default,
    models::{publication::Publication, rule::Rule},
    storeable::Storeable,
};
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Feat {
    // CompendiuancestrymFile
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,
    pub action_type: String,
    pub actions: Option<u8>,
    pub category: String,
    pub description: String,
    pub level: u8,
    #[serde(default, deserialize_with = "null_to_default")]
    pub prerequisites: Vec<String>,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub slug: String,
}

impl Storeable for Feat {
    fn table_name() -> &'static str {
        "feat"
    }
}
