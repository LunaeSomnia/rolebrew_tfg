use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

use crate::NewCharacterForm;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Character {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub name: String,
    pub level: u8,

    pub ancestry: String,
    pub class: String,
    pub background: String,
}

impl Character {}

impl From<NewCharacterForm> for Character {
    fn from(value: NewCharacterForm) -> Self {
        Self {
            id: ObjectId::new(),
            name: value.name,
            level: value.level,
            ancestry: value.ancestry,
            background: value.background,
            class: value.class,
        }
    }
}
