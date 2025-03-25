use serde::{Deserialize, Serialize};
use specta::Type;

use super::{Action, primary::feat::Feat};

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LinkPreview {
    pub slug: String,
    pub name: String,
    pub description: String,
    pub rarity: Option<String>,
    pub traits: Vec<String>,
}

impl From<Action> for LinkPreview {
    fn from(value: Action) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: value.rarity,
            traits: value.traits,
        }
    }
}

impl From<Feat> for LinkPreview {
    fn from(value: Feat) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: Some(value.rarity),
            traits: value.traits,
        }
    }
}
