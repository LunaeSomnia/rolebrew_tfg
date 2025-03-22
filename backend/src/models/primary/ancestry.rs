use crate::helpers::null_to_default;
use crate::{
    models::{
        boost_flaw::BoostOrFlaw, languages::Languages, publication::Publication, rule::Rule,
        size::Size, speed::Speed,
    },
    storeable::Storeable,
};
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Ancestry {
    // CompendiumFile
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,
    pub additional_languages: Languages,
    #[serde(default, deserialize_with = "null_to_default")]
    pub boosts: Vec<BoostOrFlaw>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub flaws: Vec<BoostOrFlaw>,
    pub hp: u8,
    pub reach: Option<u8>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub size: Size,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub vision: String,
    pub slug: String,
    pub speed: Speed,
    pub languages: Languages,
    #[serde(default, deserialize_with = "null_to_default")]
    pub features: Vec<AncestryFeature>,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub heritage: Vec<AncestryHeritage>,
    pub description: AncestryDescription,
}

impl Storeable for Ancestry {
    fn table_name() -> &'static str {
        "ancestry"
    }
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AncestryDescription {
    summary: String,
    roleplaying: String,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AncestryFeature {
    // CompendiumFile
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub id: String,
    pub img: String,
    pub name: String,
    #[serde(rename = "type")]
    pub entity_type: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub effects: Vec<String>,
    pub description: String,

    // System
    pub action_type: String,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub selected_traits: serde_json::Value, // TODO: Check
    pub slug: String,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AncestryHeritage {
    // CompendiumFile
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
}
