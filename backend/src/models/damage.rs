use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

use crate::helpers::Either;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Damage {
    base: DamageRoll,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DamageRoll {
    category: Option<DamageCategory>,
    damage_type: String,
    #[serde(alias = "number")]
    dice: u8,
    #[serde(alias = "faces")]
    die: Either<Die, u8>,
}

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(deny_unknown_fields)]
pub enum Die {
    #[serde(alias = "d4")]
    D4,
    #[serde(alias = "d6")]
    D6,
    #[serde(alias = "d8")]
    D8,
    #[serde(alias = "d10")]
    D10,
    #[serde(alias = "d12")]
    D12,
    #[serde(alias = "d20")]
    D20,
    #[serde(alias = "d100")]
    D100,
}

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(deny_unknown_fields)]
pub enum DamageCategory {
    #[serde(alias = "persistent")]
    Persistent,
}
