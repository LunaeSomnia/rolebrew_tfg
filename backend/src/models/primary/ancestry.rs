use crate::helpers::null_to_default;
use crate::models::{
    LinkPreview, Summary, SummaryData, SummaryDataAbbreviateType, SummaryDataNumberUnit,
    SummaryDataTagCategory,
};
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

use super::Feat;

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
    pub features: Vec<Feat>,
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

impl From<Ancestry> for Summary {
    fn from(value: Ancestry) -> Self {
        let data = vec![
            SummaryData::String {
                value: value.name.clone(),
                link: None,
                tooltip: None,
                abbreviation: None,
            },
            SummaryData::Tag {
                value: value.rarity,
                category: SummaryDataTagCategory::Rarity,
                link: None,
                tooltip: None,
                abbreviation: None,
            },
            SummaryData::Number {
                value: value.hp,
                unit: None,
            },
            SummaryData::String {
                value: value.size.to_string(),
                link: None,
                tooltip: None,
                abbreviation: None,
            },
            SummaryData::Number {
                value: value.speed.walk,
                unit: Some(SummaryDataNumberUnit::Feet),
            },
            SummaryData::String {
                value: value.boosts.iter().fold(String::new(), |acc, v| {
                    if acc.is_empty() {
                        v.to_string_shortened()
                    } else {
                        format!("{}, {}", acc, v.to_string_shortened())
                    }
                }),
                link: None,
                tooltip: None,
                abbreviation: None,
            },
            SummaryData::String {
                value: value.flaws.iter().fold(String::new(), |acc, v| {
                    if acc.is_empty() {
                        v.to_string_shortened()
                    } else {
                        format!("{}, {}", acc, v.to_string_shortened())
                    }
                }),
                link: None,
                tooltip: None,
                abbreviation: None,
            },
            SummaryData::String {
                value: value.publication.title,
                link: None,
                tooltip: None,
                abbreviation: Some(SummaryDataAbbreviateType::Source),
            },
        ];

        Self {
            id: value.fvtt_id,
            name: value.name,
            slug: value.slug,
            data,
        }
    }
}

impl From<Ancestry> for LinkPreview {
    fn from(value: Ancestry) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description.summary,
            rarity: Some(value.rarity),
            traits: value.traits,
        }
    }
}
