use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Damage {
    base: DamageRoll,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DamageRoll {
    damage_type: String,
    dice: u8,
    die: String,
}
