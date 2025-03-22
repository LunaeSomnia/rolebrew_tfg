use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", untagged, deny_unknown_fields)]
pub enum EntryData {
    String(String),
    ReferencedPage(ReferencedPage),
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ReferencedPage {
    pub page: u32,
    pub name: String,
    pub shortname: String,
    pub reference: serde_json::Value,
    pub entries: Vec<ReferencedPage>,
    pub items: Vec<ReferencedPage>,
}
