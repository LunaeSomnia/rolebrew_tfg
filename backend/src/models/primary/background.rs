use std::collections::{BTreeMap, HashMap};

use crate::helpers::null_to_default;
use crate::models::{Attribute, LinkPreview, Publication, Rule, Summary, SummaryData};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

use super::Feat;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Background {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub boosts: BTreeMap<u8, Vec<Attribute>>,
    pub description: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub features: Vec<Feat>,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub trained_skills: BackgroundTrainedSkills,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub slug: String,
}

impl Storeable for Background {
    fn table_name() -> &'static str {
        "background"
    }
}

impl From<Background> for Summary {
    fn from(value: Background) -> Self {
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

impl From<Background> for LinkPreview {
    fn from(value: Background) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: Some(value.rarity),
            traits: value.traits,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackgroundTrainedSkills {
    custom: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    lore: Vec<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    value: Vec<String>,
}
