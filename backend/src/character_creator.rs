use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type, Clone)]
pub struct Choice {
    pub label: String,
    pub value: String,
}
