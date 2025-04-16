use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Publication {
    pub license: String,
    pub remaster: bool,
    pub title: String,
    pub source: Option<String>,
    pub page: Option<String>,
}
