use serde::{Deserialize, Serialize};
use specta::Type;

use super::{
    Action,
    primary::{ancestry::Ancestry, feat::Feat},
};

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
