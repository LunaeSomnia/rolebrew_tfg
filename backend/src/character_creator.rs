use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type, Clone)]
pub struct Choice {
    label: String,
    value: String,
}
