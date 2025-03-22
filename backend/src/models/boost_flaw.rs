use serde::{Deserialize, Serialize};
use specta::Type;

use super::attribute::Attribute;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum BoostOrFlaw {
    Free,
    Grant {
        #[serde(alias = "boosts")]
        #[serde(alias = "boost")]
        #[serde(alias = "flaws")]
        #[serde(alias = "flaw")]
        att: Attribute,
    },
    Choose {
        #[serde(alias = "boosts")]
        #[serde(alias = "boost")]
        #[serde(alias = "flaws")]
        #[serde(alias = "flaw")]
        atts: Vec<Attribute>,
    },
}

impl ToString for BoostOrFlaw {
    fn to_string(&self) -> String {
        match self {
            BoostOrFlaw::Free => "Free".to_string(),
            BoostOrFlaw::Grant { att } => att.to_string(),
            BoostOrFlaw::Choose { atts } => {
                let mut str = String::new();
                for (i, att) in atts.iter().enumerate() {
                    if i != 0 {
                        str.push_str(" or ");
                    }
                    str.push_str(&att.to_string());
                }
                str
            }
        }
    }
}

impl BoostOrFlaw {
    pub fn to_string_shortened(&self) -> String {
        match self {
            BoostOrFlaw::Free => "Free".to_string(),
            BoostOrFlaw::Grant { att } => att.to_string_shortened(),
            BoostOrFlaw::Choose { atts } => {
                let mut str = String::new();
                for (i, att) in atts.iter().enumerate() {
                    if i != 0 {
                        str.push_str(" or ");
                    }
                    str.push_str(&att.to_string_shortened());
                }
                str
            }
        }
    }
}
