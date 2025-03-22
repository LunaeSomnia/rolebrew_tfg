use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Meta {
    core_version: String,
    system_id: String,
    system_version: String,
    compendium_source: String,
}
