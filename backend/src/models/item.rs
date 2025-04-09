use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Item {
    ref_slug: Option<String>,
    img: Option<String>,
    level: Option<u8>,
    name: String,
    uuid: String,
}
