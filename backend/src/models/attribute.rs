use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(deny_unknown_fields)]
pub enum Attribute {
    #[serde(alias = "str")]
    Strength,
    #[serde(alias = "dex")]
    Dexterity,
    #[serde(alias = "con")]
    Constitution,
    #[serde(alias = "int")]
    Intelligence,
    #[serde(alias = "wis")]
    Wisdom,
    #[serde(alias = "cha")]
    Charisma,
}

impl Attribute {
    pub fn to_string_shortened(&self) -> String {
        self.to_string()[0..3].to_string()
    }
}
