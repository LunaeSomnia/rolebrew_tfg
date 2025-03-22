use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Item {
    ref_slug: String,
    img: String,
    level: u8,
    name: String,
    uuid: String,
}
