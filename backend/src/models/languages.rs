use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Languages {
    count: Option<u8>,
    value: Vec<String>,
    custom: Option<String>,
}
