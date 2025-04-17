use crate::helpers::Either;
use crate::helpers::null_to_default;
use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Damage {
    base: DamageRoll,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DamageRoll {
    apply_mod: Option<bool>,
    category: Option<DamageCategory>,
    damage_type: Option<Either<DamageType, String>>,
    #[serde(alias = "number")]
    dice: Option<u8>,
    #[serde(alias = "faces")]
    die: Option<Either<Die, u8>>,
    formula: Option<String>,
    kind: Option<DamageKind>,
    #[serde(default, deserialize_with = "null_to_default")]
    kinds: Vec<DamageKind>,
    #[serde(default, deserialize_with = "null_to_default")]
    materials: Vec<String>,
    #[serde(rename = "type")]
    roll_type: Option<String>,
    persistent: Option<PersistentDamage>,
    value: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PersistentDamage {
    faces: Option<u8>,
    number: u8,
    #[serde(rename = "type")]
    damage_type: Option<PersistentDamageType>,
}

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(rename_all = "camelCase")]
pub enum PersistentDamageType {
    Bleed,
    Poison,
    Fire,
    Acid,
    Piercing,
    Void,
}

#[derive(Serialize, Deserialize, Debug, Type, Clone, EnumString, Display)]
#[serde(rename_all = "camelCase")]
pub enum DamageType {
    Bludgeoning,
    Piercing,
    Slashing,
    Mental,
    Force,
    Poison,
    Fire,
    Acid,
    Spirit,
    Sonic,
    Electricity,
    Cold,
}

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(rename_all = "camelCase")]
pub enum DamageKind {
    Damage,
    Healing,
}

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(deny_unknown_fields)]
pub enum Die {
    #[serde(alias = "d0", alias = "")]
    D0,
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
#[serde(rename_all = "camelCase")]
pub enum DamageCategory {
    Splash,
    Persistent,
}
