use serde::{Deserialize, Serialize};
use specta::Type;

use super::primary::{ancestry::Ancestry, feat::Feat};

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Summary {
    // meta
    pub id: String,
    pub slug: String,
    pub name: String,

    pub data: Vec<SummaryData>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(tag = "type", deny_unknown_fields)]
pub enum SummaryData {
    String {
        value: String,
        tooltip: Option<String>,
        link: Option<String>,
        abbreviation: Option<SummaryDataAbbreviateType>,
    },
    Number {
        value: u8,
        unit: Option<SummaryDataNumberUnit>,
    },
    Tag {
        value: String,
        tooltip: Option<String>,
        link: Option<String>,
        category: SummaryDataTagCategory,
        abbreviation: Option<SummaryDataAbbreviateType>,
    },
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub enum SummaryDataNumberUnit {
    Feet,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub enum SummaryDataAbbreviateType {
    Source,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub enum SummaryDataTagCategory {
    Rarity,
}

// impls

impl From<Feat> for Summary {
    fn from(value: Feat) -> Self {
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
