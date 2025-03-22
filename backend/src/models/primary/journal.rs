use serde::{Deserialize, Serialize};
use specta::Type;

use crate::storeable::Storeable;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase")]
pub struct Journal {
    pub id: String,
    #[serde(rename = "type")]
    pub page_type: String,
    pub name: String,
    pub text: String,
}

impl Storeable for Journal {
    fn table_name() -> &'static str {
        "journals"
    }
}
