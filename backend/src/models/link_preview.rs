use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LinkPreview {
    pub slug: String,
    pub name: String,
    pub description: String,
    pub rarity: Option<String>,
    pub traits: Vec<String>,
}
